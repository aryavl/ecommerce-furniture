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

   

    res.render('productDetail',{product})
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
        cartData.push({user:user, count: item.count, product: product });
      }
    }
    return cartData;
  };
    try{
      
      if(req.session.id){
        const user = await User.findOne({ email: req.session.userId }, { cart: 1, _id: 0 });
        const userList =await User.findOne({email:req.session.userId})
        //   console.log(user);
              if (user) {
                const cartData = await getCartItems(user);
        //   [{count,product}]
                const uniqueCartItems = cartData.filter((item, index, self) =>
                  index === self.findIndex(t => t.product && t.product._id.equals(item.product._id))
                );
                // console.log(userList.address.items); [{},{}]

                res.render('checkout',{user:user,addressList:userList.address.items,productData:uniqueCartItems})
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
        res.render('confirmOrder')
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
        
        cartData.push({user:user, count: item.count, product: product });
      }
    }
    return cartData;
  };
    try{
      const grandTotal = req.body.grandTotal
      const paymentMode = req.body.paymentMethod
      const address= req.body.address
      console.log(req.body);
      const user = await User.findOne({ email: req.session.userId }, { cart: 1, _id: 0 });
      const userList = await User.findOne({ email: req.session.userId })
      // console.log(user);
      if (user) {
        const cartData = await getCartItems(user);
//   [{count,product}]
      
        const uniqueCartItems = cartData.filter((item, index, self) =>
          index === self.findIndex(t => t.product && t.product._id.equals(item.product._id))
        );
        const orderItems = uniqueCartItems.map(item => ({
          product: item.product._id,
          quantity: item.count,
        }));
        for (const item of orderItems) {
          const product = await Products.findOne({ _id: item.product });
  
          if (product) {
            // Decrease the stock by the quantity in orderItems
            product.stock -= item.quantity;
            await product.save();
          }
        }
        const orderid =generateShortUUID();
        // console.log("orderid",orderid);
        // Create a new Order and insert the orderItems
        const order = await Order.create({
          orderId:orderid,
          address:address,
          user: userList._id, 
          paymentMethod: paymentMode,
          totalAmount: grandTotal,
          orderItems: orderItems,
        });
        await User.updateOne(
          {email:req.session.userId},
          {$unset:{"cart":1}}
          )
      }
      req.session.check=true
      res.render('confirmOrder')
    }catch(err){
        console.error("postCheckout",err.message);
    }
}


// module.exports.postCheckout = async (req, res) => {
//   try {
//     const grandTotal = req.body.grandTotal;
//     const paymentMode = req.body.paymentMethod;
//     const address = req.body.address;
//     console.log(req.body);

//     const user = await User.aggregate([
//       { $match: { email: req.session.userId } },
//       {
//         $lookup: {
//           from: 'Products',
//           localField: 'cart.productId',
//           foreignField: '_id',
//           as: 'product',
//         },
//       },
//       {
//         $unwind: '$product',
//       },
//       {
//         $project: {
//           _id: 0,
//           cart: 1,
//           product: 1,
//         },
//       },
//     ]);

//     if (user.length > 0) {
//       const cartData = user.map((item) => ({
//         user: item,
//         count: item.cart.find((cartItem) =>
//           cartItem.productId.equals(item.product._id)
//         ).count,
//         product: item.product,
//       }));

//       const uniqueCartItems = cartData.filter(
//         (item, index, self) =>
//           index ===
//           self.findIndex((t) => t.product && t.product._id.equals(item.product._id))
//       );

//       const orderItems = uniqueCartItems.map((item) => ({
//         product: item.product._id,
//         quantity: item.count,
//       }));

//       const orderid = generateShortUUID();
//       // console.log("orderid",orderid);
//       // Create a new Order and insert the orderItems
//       const order = await Order.create({
//         orderId: orderid,
//         address: address,
//         user: user[0]._id,
//         paymentMethod: paymentMode,
//         totalAmount: grandTotal,
//         orderItems: orderItems,
//       });

//       await User.updateOne(
//         { email: req.session.userId },
//         { $unset: { cart: 1 } }
//       );
//     }
//     res.render('confirmOrder');
//   } catch (err) {
//     console.error('postCheckout', err.message);
//   }
// };

