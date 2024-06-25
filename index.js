require('dotenv').config()
const express = require('express') // Importing express module
const morgan = require('morgan') // Importing morgan 
const cors = require('cors') // Import cors
const Person = require('./models/person') // Import Person class 


const app = express() // app can now access the ease of using express to build the backend


/**
 * End of the day, middleware are really just functions that do something with the request before the routes, or can be done after the routes - like in the case of response.status(400).json({'error': 'no page found'})
*/
app.use(cors())
app.use(express.static('dist'))
app.use(express.json()) // Middleware to parse request body as json
/**
 * Create my own token that will return request.body
 * I need to use JSON.stringify here because the logger needs to receive STRINGS vs a JS object
 * Why is request.body a JS object? Because of express.json() which parsed JSON into JS object earlier
*/
morgan.token('request-body', (request, response) =>  JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body')) // Middleware to console log request data 

let phonebook = [
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

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Exercise</h1>')
})

/**
 * Get all persons
 */
app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
})

/**
 * Info for how many entries in the database
 */
app.get('/info', async (request, response, next) => {
    try {
        const count = await Person.estimatedDocumentCount()
        const date = new Date()
        return response.send(`<p>Phonebook has info for ${count} people</p> <p>${date}</p>`)
    } catch (error) {
        next(error)
    }
})

const getPerson = (id) => phonebook.find(person => person.id === id)

/**
 * Return one person by id
 */
app.get('/api/persons/:id', async (request, response, next) => {
    try {
        console.log(request.params.id)
        const person = await Person.findById(request.params.id)
        response.json(person)
    } catch (error) {
        next(error)
    }
})

/**
 * Delete person
 */
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

/**
 * Posting new Person
 */
app.post('/api/persons', async (request, response, next) => {
   const body = request.body

    try {
        const person = new Person({
            name: body.name,
            number: body.number
        })
        const savedPerson = await person.save()
        response.json(savedPerson)
    } catch (error) {
        next(error)
    }
})

/**
 * Update number
 */
app.put('/api/persons/:id', async (request, response, next) => {
    try {
        const body = request.body
        const updatePerson = {
            name: body.name,
            number: body.number
        }

        const updatedPerson = await Person.findByIdAndUpdate(request.params.id, updatePerson, { new: true })

        return response.json(updatedPerson)
    } 
    catch (error) {
        next(error)
    }
})

/**
 * 
 * Error handler middleware
 */
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).json({
            error: "Malformatted id"
        })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})