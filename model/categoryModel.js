const mongoose = require('mongoose')
const db = require('../config/db')

const categorySchema = new mongoose.Schema({
    
    categoryName:{
        type: String,
        required:true,
        lowercase: true
    },
    image:{
        type:String,
        // required:true
    },
    description:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        default:0
    },
    // products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
    
    
    
})
const Category = db.model('Category',categorySchema)
module.exports=Category