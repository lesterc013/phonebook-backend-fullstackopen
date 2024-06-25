/**
 * Import mongoose
 * Set the URL and connect to it
 * Create the Schema for how each Person should be recorded
 * Make changes to how the Schema should be set when it is returned as JSON
 * Export the model as a module to be used in the backend code
 */

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB', error.message)
    }) 

const personSchema = mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// const Person = mongoose.model('Person', personSchema) Instead of creating a Person

module.exports = mongoose.model('Person', personSchema) // Export it
