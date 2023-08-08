const { json } = require("express");
const Order = require("../../model/orderModel");
const Products = require("../../model/productModel");
const User = require("../../model/userModel");
const { findOne } = require("../../model/adminModel");


module.exports.getOrderList=async(req,res)=>{
try{
    // const orders = await Order.find({});
    // console.log(orders); // [{}]
    const orders = await Order.aggregate([
      {
        $match: {
          isList: true
        }
      }
    ]);
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
    res.render('orderManagement',{orders:orderList})
}catch(err){
    console.error("getOrderList",err.message);
}
}


module.exports.postOrderUpdate=async(req,res)=>{
    try{
      //  console.log(req.body);
      const pipeline = [
        { $match: { orderId: req.body.orderId } },
        {
          $project: {
            orderStatus: 1,
          },
        },
      ];
      
      const order = await Order.aggregate(pipeline);
      
      if (order.length > 0) {
        const currentStatus = order[0].orderStatus;
      
        let updateStatus;
        let newStatus;
      
        if (currentStatus === "pending") {
          updateStatus = "processing";
          newStatus = "processing";
        } else if (currentStatus === "processing") {
          updateStatus = "delivered";
          newStatus = "delivered";
        }
      
        if (updateStatus) {
          await Order.updateOne(
            { orderId: req.body.orderId },
            [{ $set: { orderStatus: updateStatus } }],
          );
      
          res.send({ status: newStatus });
        } else {
          res.send({ status: currentStatus });
        }
      } else {
        res.status(404).send({ error: "Order not found" });
      }
      
      
    }catch(err){
        console.error("postOrderUpdate",err.message);
    }
}
module.exports.getOrderUpdate=async(req,res)=>{
    try{
        console.log(req.body);
    }catch(err){
        console.error("postOrderUpdate",err.message);
    }
}
module.exports.getOrderDetails=async(req,res)=>{
    try{
        console.log(req.query);
        const order= await Order.findOne({orderId:req.query.id})
        // console.log(order);
        if (order) {
      const user = await User.findOne({ _id: order.user });
     let orderDetails=[]
     let orders={ address:order.address,
      name:user.name,
      orderStatus:order.orderStatus,
      totalAmount:order.totalAmount,
      purchaseDate:order.purchaseDate,
      deliveryDate:order.deliveryDate,
      paymentMethod:order.paymentMethod}
      orderDetails.push(orders)
    for (const orderItem of order.orderItems) {
      const product = await Products.findOne({ _id: orderItem.product }); 
      if (product) {
       
        const orderDetail = {

          productName: product.productName,
          quantity: orderItem.quantity

      };
      orderDetails.push(orderDetail);
          // console.log(`Product Name: ${product.productName}, Quantity: ${orderItem.quantity}`);
      } else {
          console.log(`Product not found for productid: ${orderItem.productid}`);
      }
  }
  console.log(orderDetails);
  res.render('orderDetails',{orderDetails})
} else {
    console.log("Order not found");
}




    }catch(err){
        console.error("postOrderUpdate",err.message);
    }
}

module.exports.postCancelOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const cancelableStatuses = ["pending", "processing"];

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.send({ message: "Order not found" });
    }

    if (!cancelableStatuses.includes(order.orderStatus)) {
      return res.send({status:"delivered", message: "Cannot cancel order with current status" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { $set: { orderStatus: "cancel" } },
      { new: true } // This ensures that the updated order is returned
    );

    res.send({ status: "cancel", message:"Order cancelled" });
  } catch (err) {
    console.error(" ------>postCancelOrder<------", err.message);
    res.status(500).send({ status: "Error occurred while canceling order" });
  }
};