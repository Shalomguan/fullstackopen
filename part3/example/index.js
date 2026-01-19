require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const Note = require('./models/note')

const app = express()

// ---------- middleware ----------
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use(express.static('dist'))

// ---------- routes ----------
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response, next) => {
  Note.find({})
    .then((notes) => response.json(notes))
    .catch(next)
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (!note) return response.status(404).end()
      response.json(note)
    })
    .catch(next)
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then((savedNote) => response.json(savedNote))
    .catch(next)
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (!result) return response.status(404).end()
      response.status(204).end()
    })
    .catch(next)
})

// ---------- unknown endpoint ----------
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// ---------- error handler ----------
const errorHandler = (error, request, response, next) => {
  console.error(error.name, error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// ---------- db connect & start ----------
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
const PORT = process.env.PORT || 3001

if (!url) {
  console.error('MONGODB_URI is missing')
  process.exit(1)
}

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  })
