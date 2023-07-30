const mongoose = require('mongoose')
const db = require('../config/db.js')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        
    },
    email:{
        type:String,
       
        required:true
    },
    phone:{
        type:Number,
    },
    password:{
        type:String,

    },
    
    otp:{
        type:String
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    cart:{
        type:Array,
    } ,
   
    
})

const User = db.model('User',userSchema)
module.exports = User