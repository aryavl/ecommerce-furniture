const Products = require("../../model/productModel");

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
        console.log("getProducts -- products", products);
        res.render('products',{products:products})
    }catch(err){
        console.error("getProducts ===> ",err.message);
    }
}