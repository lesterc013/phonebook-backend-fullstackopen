const express = require('express') // Importing express module
const morgan = require('morgan') // Importing morgan 
const cors = require('cors') // Import cors


const app = express() // app can now access the ease of using express to build the backend


/**
 * End of the day, middleware are really just functions that do something with the request before the routes, or can be done after the routes - like in the case of response.status(400).json({'error': 'no page found'})
*/
app.use(cors())
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

app.get('/api/persons', (request, response) => {
    // response.send(phonebookData) -- nothing wrong with this if data passed in is json - except .json converts non-json to json so that would help filter another layer
    response.json(phonebook)
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = getPerson(id)
    
    if (!person) {
        return response.status(400).json({
            "error": "Bad request: ID requested is not in phonebook"             
        })
    }

    phonebook = phonebook.filter(person => person.id !== id)
    // response.json(phonebook) -- Should not have any response after a DELETE, just send back status 204 which means successful request and no additional info to send back
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
   const body = request.body
   if (!body.name || !body.number) {
        return response.status(400).json({
            "error": "Name and/or number is missing!"
        })
   }
   else if (phonebook.find(person => person.name === body.name)) {
        return response.status(400).json({
            "error": "Person already in phonebook!"
        })
   }

   const newID = Math.floor(Math.random() * (999 - (phonebook.length + 1)))
   const newPerson = {
        "name": body.name,
        "number": body.number,
        "id": newID
   }
   phonebook = phonebook.concat(newPerson)
   response.json(phonebook)
})

const PORT = 3001
app.listen(PORT)
console.log('Server running on port', PORT)