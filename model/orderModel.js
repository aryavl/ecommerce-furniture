const mongoose = require('mongoose')
const db = require('../config/db')
const orderSchema = new mongoose.Schema({
    orderId : {
        type : String,
        required : true
    },
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        
    },
    
    orderStatus : {
        type : String,
       
        default : "pending"
    },
    orderItems : {
        type : Array,
        required : true
    },
    totalAmount : {
        type : Number,
    },
    purchaseDate : {
        type : Date,
        default : new Date()
    },
    deliveryDate : {
        type : Date,
        default : null
    },
    paymentMethod :{
        type : String,
    },
    address:{
        type:String,
    },
    isList:{
        type:Boolean,
        default:true,
    }
})

const Order = db.model("Order",orderSchema);

module.exports = Order;