require('dotenv').config()
const dns = require('dns')
dns.setDefaultResultOrder('ipv4first')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
mongoose.set('bufferCommands', false)

const uri = process.env.MONGODB_URI
console.log('TEST FILE:', __filename)
console.log('MONGODB_URI present:', Boolean(uri))

if (!uri) {
  console.error('MONGODB_URI is missing')
  process.exit(1)
}

mongoose.connection.on('connected', () => console.log('EVENT: connected'))
mongoose.connection.on('error', (e) => console.log('EVENT: error', e.message))
mongoose.connection.on('disconnected', () => console.log('EVENT: disconnected'))

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000,
})
  .then(async () => {
    console.log('connected (then)')
    const r = await mongoose.connection.db.admin().ping()
    console.log('ping ok:', r)
    process.exit(0)
  })
  .catch(err => {
    console.error('connect failed:', err.name, err.message)
    process.exit(1)
  })
