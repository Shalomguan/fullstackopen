const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://shalongguan_db_user:${password}@cluster0.iwzdvk2.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const PhonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Persons = mongoose.model('Phonebook', PhonebookSchema)
const name = process.argv[3]
const number = process.argv[4]
// const person = new Persons({
//     name: name,
//     number: number,
// })

// person.save().then(result => {
//   console.log('added '+name+' number '+number+' to phonebook')
//   mongoose.connection.close()
// })
Persons.find({}).then(result => {
  result.forEach(persons => {
    console.log(persons)
  })
  mongoose.connection.close()
})