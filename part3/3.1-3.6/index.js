const express = require('express')
const app = express()
app.use(express.json())
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
    return Math.floor(Math.random()*maxId)
}
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name) {
        return res.status(400).json({
            error : "content missing"   
        })
    }
    const note = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    data = data.concat(note)
    res.json(note)
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
PORT = 3001

app.listen(PORT)
console.log(`Server running on port ${PORT}`)