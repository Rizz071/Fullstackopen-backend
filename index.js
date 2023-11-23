require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())
var morgan = require('morgan')

morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))




const Person = require('./models/person')


app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})


app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                console.log('Entity not founded in db')
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {

    const { name, number } = request.body

    Person.findByIdAndUpdate(request.params.id, { name, number },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {

    console.log(request.body.name, request.body.number)
    const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
    })

    console.log(newPerson)

    newPerson
        .save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.log("errorHandler func started...", error.name)

    console.error('Error name: ', error.name)
    console.error('Error message: ', error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})