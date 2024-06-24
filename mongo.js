/**
 * Import mongoose
 * Set the URL and connect to it
 * Create the Schema for how each Person should be recorded
 * Then use the Schema to create the Model
 * Then either save it to Mongo or display in command line
 */

const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://lesterc013:${password}@cluster0.cyovdst.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    
    const person = new Person({
        name: name,
        number: number
    })
    
    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
