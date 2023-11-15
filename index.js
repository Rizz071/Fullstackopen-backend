const express = require('express')
const app = express()

app.use(express.json())
var morgan = require('morgan')
app.use(morgan('tiny'))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]



app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (!person) {
        response.status(404).end()
    } else {
        response.json(person)
    }
})


app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {

    const newPerson = request.body

    if (!newPerson) {
        return response.status(400).json({
            error: 'error: content missing'
        })
    }

    if (!newPerson.name || !newPerson.number) {
        return response.status(400).json({
            error: 'error: name or number is missing'
        })
    }

    if (persons.filter(person => person.name.toLowerCase() === newPerson.name.toLowerCase()).length > 0) {
        return response.status(400).json({
            error: 'error: name must be unique'
        })
    }

    const id = Math.floor(Math.random() * 1000000)
    console.log(`random id generated: ${id}`)
    newPerson.id = id

    persons = persons.concat(request.body)

    response.json(request.body)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})