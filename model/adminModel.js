const mongoose = require('mongoose')
const db = require('../config/db.js')

const adminSchema = new mongoose.Schema({
    email:String,
    password:String
})
const Admin = db.model('Admin',adminSchema)
module.exports = Admin