require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())
var morgan = require('morgan')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))




const Person = require('./models/person')


app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

// app.get('/api/info', (request, response) => {
//     response.send(
//         `<p>Phonebook has info for ${persons.length} people</p>
//         <p>${new Date()}</p>`)
// })

app.get('/api/persons/:id', (request, response) => {

    Person.findById(request.params.id)
        .then(person => response.json(person))
        .catch(error => {
            console.log('Entity not founded in db')
            response.status(404).end()
        })
})


app.delete('/api/persons/:id', (request, response) => {

    Person.deleteOne({ _id: request.params.id })
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => {
            response.status(404).end()
        })
})

app.post('/api/persons', (request, response) => {

    if (!request.body || !request.body.name || !request.body.number) {
        return response.status(400).json({ error: 'content missing' })
    }

    const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
    })

    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


const PORT = process.env.PORT
// const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})