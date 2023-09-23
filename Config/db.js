const mongoose = require('mongoose')

const db = mongoose.createConnection(process.env.MONGODB_URI)

module.exports = db