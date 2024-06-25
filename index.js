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

app.get('/info', (request, response) => {
    const date = new Date()

    response.send(`<p>Phonebook has info for ${phonebook.length} people</p> <p>${date}</p>`)
})

const getPerson = (id) => phonebook.find(person => person.id === id)

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = getPerson(id)

    if (!person) {
        return response.status(400).json({
            "error": "Bad request: ID requested is not in phonebook"             
        })
    }
    
    response.json(person)
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
app.post('/api/persons', (request, response) => {
   const body = request.body
   if (!body.name || !body.number) {
        return response.status(400).json({
            "error": "Name and/or number is missing!"
        })
   }

   // Create the person object first with the request body data
   const person = new Person({
        name: body.name,
        number: body.number
   })

   // Save using the created person object
   person.save().then(savedPerson => {
        response.json(savedPerson)
   })

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

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})