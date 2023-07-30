const Products = require("../../model/productModel")
const User = require("../../model/userModel")

module.exports.getProductDetail= async(req,res)=>{
try{
    const id= req.query.id
    // console.log("pdt",req.session);
    const product = await Products.findOne({_id:id})

   

    res.render('productDetail',{product})
}catch(err){
console.error("getProductDetail",err.message);
}
    

}

module.exports.postCartItem = async(req,res)=>{
    try{ 
        const { productId, count } = req.body;
        console.log("Message received from frontend:", productId, count, req.session.userId);
        
        const product = await Products.findOne({ _id: productId });
        
        if (req.session.userId) {
          const user = await User.findOne({ email: req.session.userId }, { cart: 1, _id: 0 });
          let data = user;
          let { cart } = data;
        //   const filteredData = cart.filter((item, index, arr) => {
        //     const firstIndex = arr.findIndex((el) => el.productId === item.productId);
        //     return index === firstIndex;
        //   });
        
          let found = false;
        
          for (const item of cart) {
            const { productId } = item;
            if (productId === req.body.productId) {
              found = true;
              break;
            }
          }
        
          if (found) {
            await User.updateOne(
                { email: req.session.userId, "cart.productId": req.body.productId },
                { $inc: { "cart.$.count": parseInt(count) } } // Increment the count by the given value
              );
            // res.render('productDetail', { product, message: "already carted" });
            res.send(JSON.stringify({remove:true,message: "already carted" }));
          } else {
            await User.updateOne({ email: req.session.userId }, {
              $push: { cart: { count: Number(req.body.count), productId: req.body.productId } }
            });
           
            res.render('productDetail', { product});
          }
        }
        else if(req.session.userId === undefined){
                res.render('productDetail',{product,message:"Please Login"})
            }
                
              
          
    }catch(err){
        console.error("postCartItem",err.message);
    }
}

module.exports.postAddTocart=async(req,res)=>{
    try {
        
        // Extract data from the request body
        const { quantity, productId } = req.body;
    
        // Perform database operation
        // Assuming you have a 'Cart' collection with fields 'quantity' and 'productId'
         await User.updateOne({email:req.session.userId},{$addToSet:{
            cart:{count:quantity,productId:productId}
        }})
       res.redirect('/product-detail')
    
        // Respond to the frontend with a success message or data
        // res.json({ success: true, message: 'Item added to cart successfully' });
      } catch (err) {
        console.error("Error adding item to cart:", err.message);
        res.status(500).json({ success: false, message: 'Failed to add item to cart' });
      }
}

module.exports.getCheckout=async(req,res)=>{
    try{
        res.render('checkout')
    }catch(err){
        console.error("getCheckout",err.message);
    }
}
module.exports.getProductList = async(req,res)=>{
    
}
module.exports.getAddress = async(req,res)=>{
    try{
        res.render('address')
    }catch(err){
        console.error("getaddress",err.message);
    }
}
module.exports.getConfirmOrder = async(req,res)=>{
    try{
        res.render('confirmOrder')
    }catch(err){
        console.error("getConfirmOrder",err.message);
    }
}

