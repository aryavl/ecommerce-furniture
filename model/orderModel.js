const mongoose = require('mongoose')
const db = require('../config/db')
const orderSchema = new mongoose.Schema({
    // orderid : {
        // type : String,
        // required : true
    // },
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        
    },
    
    orderStatus : {
        type : String,
        required : true,
        default : "Pending"
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
    }
})

const Order = new mongoose.model("Order",orderSchema);

module.exports = Order;