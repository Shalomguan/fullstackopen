const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.use(morgan('tiny'))
app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(data)
})
app.get('/info', (request, response) => {
    const number = data.length
    const date = new Date()
    response.send(`
        <p>Phonebook has info for ${number} people</p>
        <p>${date}</p>
    `)
})
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = data.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {    
        res.status(404).end()
    }
    
})
const generateId = () => {
    const maxId = 10000000
    return String(Math.floor(Math.random()*maxId))
}
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name||!body.number) {
        return res.status(400).json({
            error : "content missing"   
        })
    } else if (data.find(person => person.name === body.name)) {
        return res.status(400).json({
            error:"name must be unique"
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    data = data.concat(person)
    res.json(person)
})
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    person = data.find(person => person.id === id)
    if (person) {
        data = data.filter(person => person.id !== id)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})
/*
Add the morgan middleware to your application for logging. 
Configure it to log messages to your console based on the tiny configuration.
*/
const PORT = process.env.PORT || 3001

app.listen(PORT)
console.log(`Server running on port ${PORT}`)