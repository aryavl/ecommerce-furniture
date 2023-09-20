const Order = require("../../model/orderModel");
const Products = require("../../model/productModel");
const User = require("../../model/userModel");
const { v4: uuidv4 } = require('uuid');
function generateShortUUID() {
    const uuid = uuidv4().split('-')[0]; // Get the first part of the UUID
    const shortUUID = '0'+ uuid.slice(0, 4); // Take the first 4 characters and prepend #
    return shortUUID;
  }
module.exports.postWallet= async(req,res)=>{
    try{
        // const user = await User.findOne({email:req.session.userId})
        // console.log("USERRR &&&&&&",user);
        console.log(req.body);
        const grandTotal = Number(req.body.total);
        const paymentMode = req.body.paymentMode;
        const address= req.body.address;
        
        let wallet = await User.findOne({email:req.session.userId})
        if(wallet.wallet < grandTotal || wallet.wallet <0){
         res.status(400).json({success: false})
        } else{
 // console.log(req.body);
 const user = await User.findOne({ email: req.session.userId }, { cart: 1 });
 // console.log("user========",user);
 if (user) {

   const orderItems = [];
   user.cart.forEach(item => {
     orderItems.push({
     product_id: item.productId,
     quantity: item.count,
 })});
 console.log(orderItems,"---------->ORDER ITEM");
 orderItems.forEach(async (orderItem) => {
   try {
     // Find the product in the database by product_id
     const product = await Products.findOne({_id: orderItem.product_id });
     
 console.log("productts======",product);
     // If the product is found, decrement the stock_quantity
     if (product) {
       product.stock -= orderItem.quantity;
         price = orderItem.price

       // Save the updated product back to the database
       await product.save();
     }
   } catch (error) {
     console.error('Error updating product stock:', error);
   }
 });

   const orderid =generateShortUUID();
const currentDate = new Date();

// Add 10 days to the current date I am setting 10days after purchase date for delivery date

const updatedDate=currentDate.setDate(currentDate.getDate() + 10);
 const order = await Order.create({
     orderId:orderid,
     address:address,
     user: user._id, 
     orderItems:orderItems,
     paymentMethod: paymentMode,
     totalAmount: grandTotal,
     orderItems: orderItems,
     deliveryDate:updatedDate
   });
const usernew = await User.findOne({email:req.session.userId})
const userWallet = usernew.wallet - grandTotal
console.log("WALLETTT",usernew.wallet);
// console.log(updatedDateAsString);
  // console.log(order);
   await User.updateOne(
     {email:req.session.userId},
     {$unset:{"cart":1}, $set:{'wallet':userWallet}},
     
     )

    
     return res.status(200).json({ success: true });
 }

        }
       

    }catch(err){
        console.error("postWallet ===>",err.message);
    }
}

module.exports.getWallet=async(req,res)=>{
    

    try{
        const user = await User.findOne({ email: req.session.userId });
    const wallet = await Order.find({paymentMethod:'wallet',user:user._id})
    console.log("$$$$");
    console.log(wallet);
    console.log("$$$$");
    
        res.render('wallet',{user,wallet })
    }catch(err){
        console.error("getWallet ----> ",err.message);
    }
}