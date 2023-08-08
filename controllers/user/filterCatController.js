const Products = require("../../model/productModel");
const { ObjectId } = require('mongodb');
const User = require("../../model/userModel");
const Category = require("../../model/categoryModel");
module.exports.getFilterCat=async(req,res)=>{
    try{
        if(req.query.id!==""){
        const id = new ObjectId(req.query.id);
        console.log(id);
        console.log("------------------------------------------");
        const user =await User.findOne({email:req.session.userId})
        const categories = await Category.aggregate([
            {
              $match: {
                isList: true
              }
            }
          ]);
        const productsWithCategory = await Products.find({ category: id }).populate('category');

        const productsWithCategoryy = await Products.aggregate([
            {
              $match: {
                category: id
              }
            },
            {
              $lookup: {
                from: 'Category',  // Assuming the collection name for categories is 'categories'
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            },
            {
              $unwind: '$category'
            }
          ]);
           res.render('home',{user:user,products:productsWithCategory,category:categories})
        }else{
            
        }
        console.log(productsWithCategoryy);
    }catch(err){
        console.error("getFilterCat ---->",err.message);
    }
}