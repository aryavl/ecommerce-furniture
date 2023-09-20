const Admin = require("../../model/adminModel")
const bcrypt = require('bcrypt')
const User = require("../../model/userModel")
const Order = require("../../model/orderModel")
const Products = require("../../model/productModel")

module.exports.getAdminLoginPage =(req,res)=>{
    // console.log("admin");
    res.render('adminLogin')
    }
module.exports.postAdminLoginPage =async(req,res)=>{
    const {email,password}=req.body
    // console.log(email);
    try{
        const admin =await Admin.findOne({})
        // console.log(admin);
        if(admin){
             const matchPass =  bcrypt.compare(password,admin.password)
                if(matchPass){
                    req.session.adminId = email
                    req.session.role = 'admin'
                    res.redirect('/admin/dashboard')
                }  
        }else{
            res.render('adminLogin',{message:"Credentials don't exists"})
        }
    }catch(e){
        console.error(e);
    }
    }
    module.exports.getAdminDashboard = async(req,res)=>{
        // console.log(req.session);
        const admin = await Admin.findOne({ email: req.session.adminId });
        const users= await User.find({})
        const products= await Products.find({})
        // console.log("user length ====",users.length);
        // console.log("product length =====",products.length);
        const orders = await Order.aggregate([
            {
                $unwind:"$orderItems"
            },
           
        ])
        const allOrderes = await Order.aggregate([
            {
                $unwind:"$orderItems"
            },
            {
                $match:{
                    'orderItems.orderStatus':"delivered"
                }
            }
        ])
        const pending = await Order.aggregate([
            {
                $unwind:"$orderItems"
            },
            {
                $match:{
                    'orderItems.orderStatus':"pending"
                }
            }
        ])
        const cancel = await Order.aggregate([
            {
                $unwind:"$orderItems"
            },
            {
                $match:{
                    'orderItems.orderStatus':"cancel"
                }
            }
        ])
        console.log(allOrderes.length,"deeel");
        console.log(pending.length,"pennnd");
        console.log(cancel.length,"cancel");

        const status=[{
            delivered:allOrderes.length,
            pending:pending.length,
            cancelled:cancel.length
        }]
        let totalAmount =0
        orders.forEach(item=>{
            totalAmount += item.totalAmount
            // console.log(item.orderItems);
        })
        // console.log(totalAmount);
        const productDetail = [{
            totalAmount,
            users:users.length,
            products:products.length,
            orders:orders.length,

        }];

//         // Use a for...of loop to allow asynchronous operations inside
//         for (const orderItem of orders) {
//             for (const item of orderItem.orderItems) {
//                 const product = await Products.findOne({ _id: item.product });
        
//                 if (product) {
//                     const orderDetail = {
//                         productName: product.productName,
//                         quantity: item.quantity,
//                         price: product.price,
//                         images: product.images,
//                     };
//                     productDetail.push(orderDetail);
//                 }
//             }
//         }
// console.log(productDetail);
        res.render('adminHomepage',{productDetail,allOrderes,status})
    }

 
