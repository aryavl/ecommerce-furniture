const Order = require("../../model/orderModel");
const Products = require("../../model/productModel");
const User = require("../../model/userModel");

module.exports.getSalesReport=async(req,res)=>{
    try{
        const orders = await Order.find({orderStatus:'delivered'});
        // console.log(orders); // [{}]
        const orderList = [];
    
        for (let i = 0; i < orders.length; i++) {
          const userId = orders[i].user; // Extract user ID from the order
    
          // Fetch the user information based on the extracted ID
          const user = await User.findById(userId);
            // console.log(user); user data
          // Extract orderItems from the current order
          const orderItems = orders[i].orderItems;
          const processedOrderItems = [];
    
          // Process each order item
          for (let j = 0; j < orderItems.length; j++) {
            const product = await Products.findById(orderItems[j].product);
    
            // Combine product information with quantity
            const processedOrderItem = {
              product: product,
              quantity: orderItems[j].quantity,
            };
    
            processedOrderItems.push(processedOrderItem);
          }
    
          // Combine order details with processed orderItems and user ID
          const processedOrder = {
            
           
            user: user, // Including the full user object if needed
            orderId:orders[i].orderId,
            orderStatus: orders[i].orderStatus,
            orderItems: processedOrderItems,
            totalAmount: orders[i].totalAmount,
            purchaseDate: orders[i].purchaseDate,
            deliveryDate: orders[i].deliveryDate,
            paymentMethod: orders[i].paymentMethod,
          
          };
    
          orderList.push(processedOrder);
        }
    
        // Now, orderList contains processed orders with their associated user IDs and orderItems.
        // console.log(orderList);
    
        res.render('salesReport',{orders:orderList})
    }catch(err){
        console.error("getSalesReport---->",err.message);
    }
}