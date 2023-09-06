const Category = require("../model/categoryModel");
const Products = require("../model/productModel");
const User = require("../model/userModel");

// Error handling middleware
module.exports.errorHandler=async(req, res, next) => {
    const id= req.query.id
    const product = await Products.findOne({_id:id})
    const user = await User.findOne({email:req.session.userId})
    if(product === null){
        res.status(404).render('error', { message: 'Product not found' ,user});
    }else{
        next()
    }
   
    
  };
  module.exports.categoryErrorHandler= async(req,res,next)=>{
    const id = req.query.id
    const category = await Category.findOne({_id:id})
    const user = await User.findOne({email:req.session.adminId})
    if(category === null){
        res.status(404).render('error',{message:"Category not found",user})
    }
  }