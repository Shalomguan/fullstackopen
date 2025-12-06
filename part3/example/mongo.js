const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://shalongguan_db_user:${password}@cluster0.iwzdvk2.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'Mongoose makes things easy',
//   important: true,
// })
Note.find({important:true}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })