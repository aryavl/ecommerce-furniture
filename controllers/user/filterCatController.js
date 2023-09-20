const Products = require("../../model/productModel");
const { ObjectId } = require('mongodb');
const User = require("../../model/userModel");
const Category = require("../../model/categoryModel");
const Banner = require("../../model/bannerModel");
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
        const productsWithCategory = await Products.find({ category: id ,isList:true}).populate('category');

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
          const banner = await Banner.aggregate([
            {
              $match:{
                isList:true
              }
            }
          ])
           res.render('home',{user:user,products:productsWithCategory,category:categories,banner})
        }else{
            
        }
        console.log(productsWithCategoryy);
    }catch(err){
        console.error("getFilterCat ---->",err.message);
    }
}
module.exports.postFiltercat=async(req,res)=>{
  try{
    console.log(req.body);
    const catname = req.body.catname
    const productsWithCategoryy = await Products.aggregate([
      {
        $match: {
          categoryName:catname
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
  }catch(err){
    console.error('postFiltercat ----> ',err.message);
  }
}
