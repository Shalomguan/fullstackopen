require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

mongoose.set('strictQuery', false)

// middleware
app.use(express.json())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

// routes
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date()
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `)
    })
    .catch(next)
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) response.json(person)
      else response.status(404).end()
    })
    .catch(next)
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' })
  }

  Person.findOne({ name: body.name })
    .then(existing => {
      if (existing) {
        return res.status(400).json({ error: 'name must be unique' })
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      })

      return person.save()
    })
    .then(savedPerson => {
      if (savedPerson) res.json(savedPerson)
    })
    .catch(next)
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) res.status(204).end()
      else res.status(404).end()
    })
    .catch(next)
})

// unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// connect & start
const url = process.env.MONGODB_URI
const PORT = process.env.PORT || 3001

if (!url) {
  console.error('MONGODB_URI is missing')
  process.exit(1)
}

console.log('connecting to', url)

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(error => {
    console.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  })
