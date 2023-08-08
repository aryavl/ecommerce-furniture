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
    profileImage:{
        type:String
    },
    cart:{
        type:Array,
    } ,
    address: {
        items: [{
            name: {
                type: String,
                required:true
            },
            phone: {
                type:Number,
                required: true,
            },
            houseNumber: {
                type: String,
                require: true
            },
            pincode:{
                type:Number,
                required: true,
            },
            address:{
                type: String,
                required:true
            },
            city: {
                type: String,
                required:true
            },
            state: {
                type: String,
                required:true
            },
            landmark: {
                type: String
            },
            alternatePhone: {
                type:Number
            }
        }]
    }
    
})

const User = db.model('User',userSchema)
module.exports = User