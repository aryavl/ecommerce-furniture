const { json } = require("express");
const Order = require("../../model/orderModel");
const Products = require("../../model/productModel");
const User = require("../../model/userModel");
const { findOne } = require("../../model/adminModel");
const { Mongoose } = require("mongoose");


module.exports.getOrderList=async(req,res)=>{
try{
  const pipeline = [
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $unwind: '$orderItems'
    },
    {
      $lookup: {
        from: 'products',
        localField: 'orderItems.product_id',
        foreignField: '_id',
        as: 'orderItems.product'
      }
    },
    {
      $project: {
        _id: 1, // Include any other fields you need
        user: 1,
        orderId: 1,
        orderItems: 1,
        totalAmount: 1,
        purchaseDate: 1,
        deliveryDate: 1,
        paymentMethod: 1
      }
    },
    {
      $sort: {
        purchaseDate: -1 // Sort by purchaseDate in descending order
      }
    },
    {
      $group: {
        _id: '$orderId',
        user: { $first: '$user' },
        orderId: { $first: '$orderId' },
        orderItems: { $push: '$orderItems' },
        totalAmount: { $first: '$totalAmount' },
        purchaseDate: { $first: '$purchaseDate' },
        deliveryDate: { $first: '$deliveryDate' },
        paymentMethod: { $first: '$paymentMethod' }
      }
    },
    {
      $project: {
        _id: 0,
        user: 1,
        orderId: 1,
        orderItems: 1,
        totalAmount: 1,
        purchaseDate: 1,
        deliveryDate: 1,
        paymentMethod: 1
      }
    }
  ];
  
  const orderLists = await Order.aggregate(pipeline);
  
// console.log("****************");
//    console.log("orderLists",orderLists );
// console.log("****************");

const itemsPerPage = 6; // Set the desired number of items per page
const currentPage = req.query.page ? parseInt(req.query.page) : 1;

// Perform the database query and populate fields
const orderLis = await Order.find({})
  .populate('user')
  .populate({
    path: 'orderItems.product_id',
    model: 'Products' // Replace 'Products' with the actual product model name
  })
  .sort({ purchaseDate: -1 });

// Calculate total items and total pages for pagination
const totalItems = orderLis.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);

// Calculate the startIndex and endIndex to load exactly 'itemsPerPage' items
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

// Slice the array to get items for the current page, ensuring 'itemsPerPage' items
const itemsToShow = orderLis.slice(startIndex, endIndex);

// Extract the orderItems from itemsToShow
const innerArrays = itemsToShow.map(item => item.orderItems);

// Render the page with the necessary data
res.render('orderManagement', {
  orders: orderLis,
  items: itemsToShow,
  orderItems: innerArrays,
  totalPages: totalPages,
  currentPage: currentPage,
});



}catch(err){
    console.error("getOrderList",err.message);
}
}


module.exports.postOrderUpdate=async(req,res)=>{
    try{
      //  console.log(req.body);
      const pipeline = [
        { $match: { orderId: req.body.orderId } },
        {$unwind:"$orderItems"},
        
      ];
      
      const order = await Order.aggregate(pipeline);
      // const orderr= await Order.find({orderId: req.body.orderId })
  //     const orderr = await Order.find({orderId: req.body.orderId})
  // .populate('user')
  // .populate({
  //   path: 'orderItems.product_id',
  //   model: 'Products' // Replace 'Product' with the actual product model name
  // })
  const orderr = await Order.aggregate([
    {
      $match: {
        orderId: req.body.orderId,
      },
    },
    {
      $lookup: {
        from: 'users', // Replace with the actual user collection name
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $lookup: {
        from: 'products', // Replace with the actual product collection name
        localField: 'orderItems.product_id',
        foreignField: '_id',
        as: 'orderItems.product_id',
      },
    },
    {
      $unwind: '$orderItems.product_id',
    },
    {
      $group: {
        _id: '$_id', // Group by the Order's _id field (or any other unique identifier)
        orderId: { $first: '$orderId' }, // Include other fields you need
        user: { $first: '$user' }, // Include other fields you need
        orderItems: { $push: '$orderItems' },
      },
    },
  ]);
  // i will come back
      console.log("****************");
      console.log(orderr);
      console.log("****************");
      const productId = req.body.productId
     
    
      if (orderr.length > 0) {
        const order = orderr[0];
        
        // Update the status of each item in the order
        const updatedOrderItems = order.orderItems.map((item) => {
          let updateStatus;
          const objectId = item.product_id._id
const objectIdString = objectId.toString();
const numericPortion = objectIdString.match(/[0-9a-f]+/i)[0];


          console.log(item.orderStatus,"@@@@@");
          if (numericPortion === productId) {
            switch (item.orderStatus) {
              case "pending":
                updateStatus = "processing";
                break;
              case "processing":
                updateStatus = "delivered";
                break;
              // Add more cases as needed
              
              default:
                // Handle other cases if necessary
                break;
            }
          } else {
            // If numericPortion does not match productId, keep the existing status
            updateStatus = item.orderStatus;
          }
      
          // Return a new object with the updated orderStatus
          return { ...item, orderStatus: updateStatus };
        });
        console.log("######33",updatedOrderItems);
        // Update the entire order's orderItems array with the updated values
        const updatedOrder = await Order.findOneAndUpdate(
          { orderId: req.body.orderId },
          { $set: { orderItems: updatedOrderItems } },
          { new: true } // To return the updated document
        );
      
        // Handle updatedOrder as needed (it contains the updated order)
        console.log("Updated Order:", updatedOrder);
        res.send({ status: updateStatus });
      } else {
        // Handle the case when no orders are found with the given orderId
        console.log("Order not found.");
        res.send({ status: currentStatus });

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
        const pipeline = [
          {
            $lookup: {
              from: 'users', // Replace with your actual collection name for users
              localField: 'user',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: '$user'
          },
          {
            $unwind: '$orderItems'
          },
          // {
          //   $lookup:{
          //     from:'products',
          //     localField:'product_id',
          //     foreignField:'_id',
          //     as:'product'
          //   }
          // },
          // {
          //   $unwind: '$product'
          // },

        ];
        const orderList = await Order.aggregate(pipeline);
         console.log("order list  -------------->",order);
        if (order) {
      const user = await User.findOne({ _id: order.user });
     let orderDetails=[]
     let orders={ address:order.address,
      name:user.name,
      orderStatus:order.orderItems[0].orderStatus,
      totalAmount:order.totalAmount,
      purchaseDate:order.purchaseDate,
      deliveryDate:order.deliveryDate,
      paymentMethod:order.paymentMethod}
      orderDetails.push(orders)
    const id =order.orderItems[0].product_id
      const product = await Products.findOne({ _id:id }); 
      console.log("dkfjklkk",product);
      if (product) {
       
        const orderDetail = {

          productName: product.productName,
          quantity: order.orderItems[0].quantity

      };
      orderDetails.push(orderDetail);
          // console.log(`Product Name: ${product.productName}, Quantity: ${orderItem.quantity}`);
      
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

module.exports.postFilterOrder=async(req,res)=>{
  try{
    console.log(req.body);
    const selectedStatus= req.body.selectedStatus
    const selectedDate = req.body.selectedDate
    // const formattedSelectedDate = selectedDate.split('/').reverse().join('-');
    const targetDate = new Date(selectedDate)
    if(selectedStatus ==='all'){
    const orderList = await Order.find({
     
      purchaseDate: {
        $gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()), // Start of the target date
        $lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1) // Start of the next day
      }
    })
      .populate('user')
      .populate({
        path: 'orderItems.product_id',
        model: 'Products' // Replace 'Products' with the actual product model name
      })
      .sort({ purchaseDate: -1 });
  console.log(orderList,"********************");
    res.send({ data: orderList });
}else if(selectedStatus==='pending'){
  const orderList = await Order.find({
     
    purchaseDate: {
      $gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() ), // Start of the target date
      $lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() +1) // Start of the next day
    },
   

  })
    .populate('user')
    .populate({
      path: 'orderItems.product_id',
      model: 'Products' // Replace 'Products' with the actual product model name
    })
    .sort({ purchaseDate: -1 });
    console.log("orderList",orderList); ;
//     const pendingOrders = orderList.forEach(order => {
      

      
//     });
// console.log(pendingOrders,"********************");
  // res.send({ data: pendingOrders });
}else if(selectedStatus==='cancelled'){
  const orderList = await Order.find({
     
    purchaseDate: {
      $gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()), // Start of the target date
      $lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1) // Start of the next day
    },
   

  })
    .populate('user')
    .populate({
      path: 'orderItems.product_id',
      model: 'Products' // Replace 'Products' with the actual product model name
    })
    .sort({ purchaseDate: -1 });
    const cancelOrders = orderList.filter(order => {
      return order.orderItems.some(orderItem => orderItem.orderStatus === 'cancel');
    });
console.log(cancelOrders,"********************");
  res.send({ data: cancelOrders });
}else{
  const orderList = await Order.find()
    .populate('user')
    .populate({
      path: 'orderItems.product_id',
      model: 'Products' // Replace 'Products' with the actual product model name
    })
    .sort({ purchaseDate: -1 });
console.log(orderList,"********************");
  res.send({ data: orderList });
}
// const matchStage = {
//   $match: {
//     purchaseDate: {
//       $gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()), // Start of the target date
//       $lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1) // Start of the next day
//     }
//   }
// };

// const lookupStage = {
//   $lookup: {
//     from: 'products', // Replace 'products' with the actual product collection name
//     localField: 'orderItems.product_id',
//     foreignField: '_id',
//     as: 'orderItems.product'
//   }
// };

// const unwindStage = {
//   $unwind: {
//     path: '$orderItems.product',
//     preserveNullAndEmptyArrays: true
//   }
// };

// const sortStage = {
//   $sort: {
//     purchaseDate: -1
//   }
// };

// let aggregationPipeline = [matchStage, lookupStage, unwindStage, sortStage];

// if (selectedStatus === 'pending') {
//   const matchPendingStage = {
//     $match: {
//       'orderItems.orderStatus': 'pending'
//     }
//   };

//   aggregationPipeline.push(matchPendingStage);
// }

// if (selectedStatus === 'cancelled') {
//   const matchCancelledStage = {
//     $match: {
//       'orderItems.orderStatus': 'cancel'
//     }
//   };

//   aggregationPipeline.push(matchCancelledStage);
// }

// const orderList = await Order.aggregate(aggregationPipeline);
// console.log(orderList,"********************");
//   res.send({ data: orderList });
  }catch(err){
    console.error("postFilterOrder =====> ",err.message);
  }
}