const Banner = require("../../model/bannerModel");
const Category = require("../../model/categoryModel");
const Products = require("../../model/productModel");
const User = require("../../model/userModel");

module.exports.getProducts=async(req,res)=>{
    try{
        // const products = await Products.find({})
        const products = await Products.aggregate([
            {
              $match: {
                isList: true
              }
            }
          ]);
        const category = await Category.aggregate([
          {
            $match:{
              isList:true
            }
          }
        ])
          const user = await User.findOne({email:req.session.userId})
        console.log("getProducts -- products", products);
        res.render('products',{products:products,user,category})
    }catch(err){
        console.error("getProducts ===> ",err.message);
    }
}
// not using
module.exports.postProductSearch= async(req,res)=>{
  try{
    console.log(req.body);
    const user = await User.findOne({email:req.session.userId})
    const category = await Category.aggregate([
      {
        $match:{
          isList:true
        }
      }
    ])
    const searchQuery = new RegExp("^" + req.body.search, "i"); // Adding "i" flag for case-insensitive search
    console.log(req.body.search);
    const products = await Products.find({ productName: { $regex: searchQuery }, isList: true });
    const p=await Products.find({})
  if (products.length === 0) {
    res.render('product', { products: p, user, category });
  } else {
    res.render('product', { products, user, category });
  }
}catch(err){
    console.error("postProductSearch ===> ",err.message);
}
}

module.exports.postSearchCheck=async(req,res)=>{
 
    try{
      
    const searchQuery = new RegExp("^" + req.body.search, "i"); 
    // Adding "i" flag for case-insensitive search
    const user = await User.findOne({email:req.session.userId})

    const category=await Category.find({isList:true})
    const products=await Products.find({ productName: { $regex: searchQuery, },isList:true })
    const product=await Products.find({isList:true})
    console.log("search ",products)  
    const banner = await Banner.aggregate([
      {
        $match: {
          isList: true
        }
      }
    ]);
    
    if (products.length === 0) {
        res.render('home',{ user:user,products: product, category: category ,banner})
      } else {
        res.render('home',{ user:user,products: products, category: category ,banner})
      }
  
    }
    catch(err){
console.log(err.message)
    }

}
