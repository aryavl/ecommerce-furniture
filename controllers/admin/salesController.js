const Order = require("../../model/orderModel");
const Products = require("../../model/productModel");
const User = require("../../model/userModel");
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const fs = require('fs');
module.exports.getSalesReport=async(req,res)=>{
    try{
     const orders= await Order.aggregate([
      {
        $lookup: {
          from: 'users', // Replace with your actual collection name for users
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
        {
          $unwind: "$orderItems"
        },
        {
          $match: {
            "orderItems.orderStatus": "delivered"
          }
        }
      ])
      
        // const orders = await Order.find({orderStatus:'delivered'});
        console.log(orders); // [{}]
        const orderList = [];
    
       
    
        res.render('salesReport',{orders:orders})
    }catch(err){
        console.error("getSalesReport---->",err.message);
    }
}

module.exports.postReport=async(req,res)=>{
  try{
   console.log(req.body);
   const day = req.body.day
   const month = req.body.month
   const year = req.body.year
   const selectedValue = req.body.selectedValue

   if(day){
    const order = await Order.find({})
    console.log(order);
   }
  }catch(err){
    console.error("postReport ===>",err.message);
  }
}