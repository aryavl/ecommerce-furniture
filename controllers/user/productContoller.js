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
          const user = await User.findOne({email:req.session.userId})
        console.log("getProducts -- products", products);
        res.render('products',{products:products,user})
    }catch(err){
        console.error("getProducts ===> ",err.message);
    }
}