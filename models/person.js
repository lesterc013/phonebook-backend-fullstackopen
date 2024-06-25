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
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(number) {
                if (!number.includes('-')) return false
                const splitArr = number.split('-')
                if (splitArr.length !== 2) return false
                return splitArr[0].length >= 2 && splitArr[0].length < 4
             },
             message: 'Number provided is not in the correct format'
        }
    } 
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema) // Export it
