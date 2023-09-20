
const Coupon = require("../../model/couponModel");
const Order = require("../../model/orderModel")
const Products = require("../../model/productModel")
const User = require("../../model/userModel")
const { v4: uuidv4 } = require('uuid');

function generateShortUUID() {
  const uuid = uuidv4().split('-')[0]; // Get the first part of the UUID
  const shortUUID = '0'+ uuid.slice(0, 4); // Take the first 4 characters and prepend #
  return shortUUID;
}
module.exports.getProductDetail= async(req,res)=>{
try{
    const id= req.query.id
    // console.log("pdt",req.session);
    const product = await Products.findOne({_id:id})
    const user = await User.findOne({email:req.session.userId})
   

    res.render('productDetail',{product,user:user})
}catch(err){
console.error("getProductDetail",err.message);
}
    

}

module.exports.postCartItem = async(req,res)=>{
    try{ 
        const { productId, count } = req.body;
        // console.log("Message received from frontend:", productId, count, req.session.userId);
        
        const product = await Products.findOne({ _id: productId });
       
          if (req.session.userId) {
            const user = await User.findOne({ email: req.session.userId }, { cart: 1, _id: 0 });
            let data = user;
            let { cart } = data;
         
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
              res.send(JSON.stringify( "count"));
            } else {
              await User.updateOne({ email: req.session.userId }, {
                $push: { cart: { count: Number(req.body.count), productId: req.body.productId } }
              });
             
              res.send(JSON.stringify({remove:true,message: " carted" }));
            }
          }
          else if(req.session.userId === undefined){
            res.send(JSON.stringify({message: " carted" }));
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
  const getCartItems = async (user) => {
    const cartData = [];
    for (const item of user.cart) {
    const user =await User.findOne({email:req.session.userId})
      const product = await Products.findOne({ _id: item.productId });
      if (product) {
        let total = item.count * product.price;
           
        cartData.push({user:user, count: item.count, product: product,total:total });
      }
    }
    return cartData;
  };
    try{
     
      if(req.session.id){
        const user = await User.findOne({ email: req.session.userId }, { cart: 1, _id: 0 });
        const userList =await User.findOne({email:req.session.userId})
        // console.log(userList._id.toString());
        //   console.log(user);
             
                if (user) {
                  console.log(userList.wallet);
                  const cartData = await getCartItems(user);
                  let totalArr=[]
                  cartData.map(item=>{
                      totalArr.push(item.total)
                  })
                   sub=totalArr.reduce((acc,sum)=>{return acc+sum})
        //   [{count,product}]
                const uniqueCartItems = cartData.filter((item, index, self) =>
                  index === self.findIndex(t => t.product && t.product._id.equals(item.product._id))
                );
                // console.log(userList.address.items); [{},{}]

                // const coupons = await CouponModel.find({used_users: {$ne: userId}})
                const currentDate = new Date();
                const availableCoupon=[]
                 const coupons = await Coupon.find({isList:true,userId:{$ne:userList._id}})
                  coupons.forEach(item=>{
                    const exp = new Date(item.expiryDate)
                    const bool = exp >= currentDate
                    console.log(bool);
                    if(bool){
                      availableCoupon.push(item)
                    }

                  })
                
                console.log("availableCoupon",availableCoupon);
                res.render('checkout',{user:userList,addressList:userList.address.items,productData:uniqueCartItems,total:sub,coupon:availableCoupon})
      }
    }
    }catch(err){
        console.error("getCheckout",err.message);
    }
}
module.exports.getProductList = async(req,res)=>{
    
}

module.exports.getConfirmOrder = async(req,res)=>{
    try{
      const user = await User.findOne({email:req.session.userId})
        res.render('confirmOrder',{user:user})
    }catch(err){
        console.error("getConfirmOrder",err.message);
    }
}
module.exports.postCheckout = async(req,res)=>{
  const getCartItems = async (user) => {
    const cartData = [];
    for (const item of user.cart) {
    const user =await User.findOne({email:req.session.userId})
      const product = await Products.findOne({ _id: item.productId });
      if (product) {
        let total = item.count * product.price;
           
        cartData.push({user:user, count: item.count, product: product,total:total });
      }
    }
    return cartData;
  };
    try{
      const grandTotal = Number(req.body.total);
      const paymentMode = req.body.paymentMode;
      const address= req.body.address;

 console.log("chekout",req.body);
const user = await User.findOne({ email: req.session.userId }, { cart: 1 });
// console.log("user========",user);
if (user) {

  const orderItems = [];
  user.cart.forEach(item => {
    orderItems.push({
    product_id: item.productId,
    quantity: item.count,
})});
// console.log(orderItems,"---------->ORDER ITEM");
orderItems.forEach(async (orderItem) => {
  try {
    // Find the product in the database by product_id
    const product = await Products.findOne({_id: orderItem.product_id });
    
// console.log("productts======",product);
    // If the product is found, decrement the stock_quantity
    if (product) {
      product.stock -= orderItem.quantity;

      // Save the updated product back to the database
      await product.save();
    }
    
        // const coupon = await Coupon.findOneAndUpdate(
        //     { _id: couponId },
        //     {
        //       $push: { userId: user._id }
        //     },
        //     { new: true } // To return the updated document
        //   );
          
          // console.log("Updated Coupon:", coupon);
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


// console.log(updatedDateAsString);
 // console.log(order);
  await User.updateOne(
    {email:req.session.userId},
    {$unset:{"cart":1}}
    )
    return res.status(200).json({ success: true });
}

     
      
      
    }catch(err){
        console.error("postCheckout",err.message);
        res.status(400).json({success: false})
    }
}


module.exports.postCodCheckout=async(req,res)=>{
  console.log("inside code",req.body);
}