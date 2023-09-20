const Order = require("../../model/orderModel");
const Products = require("../../model/productModel");
const User = require("../../model/userModel");
const XLSX = require('xlsx');
const fs = require('fs')
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { setMonth } = require("date-fns");
module.exports.getSalesReport=async(req,res)=>{
    try{
     const orders= await Order.aggregate([
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
          $unwind: "$orderItems"
        },
        {
          $match: {
            "orderItems.orderStatus": "delivered"
          }
        }
      ])
      
        // const orders = await Order.find({orderStatus:'delivered'});
        console.log(orders); // [{}]
        const itemsPerPage = 6; // Set the desired number of items per page
const currentPage = req.query.page ? parseInt(req.query.page) : 1;
const totalItems = orders.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);

// Calculate the startIndex and endIndex to load exactly 'itemsPerPage' items
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

// Slice the array to get items for the current page, ensuring 'itemsPerPage' items
const itemsToShow = orders.slice(startIndex, endIndex);

// Extract the orderItems from itemsToShow
const innerArrays = itemsToShow.map(item => item.orderItems);
    
       
    
        res.render('salesReport',{orders:orders,
          items: itemsToShow,
          orderItems: innerArrays,
          totalPages: totalPages,
          currentPage: currentPage,})
    }catch(err){
        console.error("getSalesReport---->",err.message);
    }
}

module.exports.postReport=async(req,res)=>{
  try{
   console.log(req.body);
   const day = req.body.day
   const month = req.body.month
   const year = req.body.year
   const selectedValue = req.body.selectedValue

   if(day){
    const order = await Order.find({})
    console.log(order);
   }
  }catch(err){
    console.error("postReport ===>",err.message);
  }
}

module.exports.postGeneratePdf=async(req,res)=>{
  try{
    let data = req.body   
    console.log("##########3",data);
    const doc = new PDFDocument();

    const filename = 'report.pdf'

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);
    
     // Generate PDF content
  doc.fontSize(16).text('List of Users', { align: 'center' }).moveDown(1);

  
    doc.text('--------------------------');
    
        data.forEach((item) => {
            doc.text(`Order Id: ${item.orderId}`)
            doc.text(`Purchaser: ${item.user.name}`)
            doc.text(`Purchase Email: ${item.user.email}`)
            doc.text(`Total Amount: ${item.totalAmount}`)
            doc.text(`Date of Delivery: ${item.deliveryDate}`)
            // doc.text(`Order Status: ${item.orderStatus}`)
            doc.text('--------------------------');
            doc.text( ' ')
            doc.text( ' ')
        })
  
    doc.end();
  
    console.log('PDF report generated successfully.');
    
  }catch(err){
    console.error("postGeneratePdf====>",err.message);
  }
}
function generateExcel(data) {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Define columns in the Excel sheet
  worksheet.columns = [
      { header: 'Order Id', key: 'orderId', width: 15 },
      { header: 'Purchaser', key: 'purchaser', width: 20 },
      { header: 'Purchase Email', key: 'purchaseEmail', width: 30 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
      { header: 'Date of Delivery', key: 'deliveryDate', width: 20 },
  ];

  // Add data rows to the Excel sheet
  data.forEach((item) => {
      worksheet.addRow({
          orderId: item.orderId,
          purchaser: item.user.name,
          purchaseEmail: item.user.email,
          totalAmount: item.totalAmount,
          deliveryDate: item.deliveryDate,
      });
  });

  return workbook;
}

module.exports.postSalesReport=async(req,res)=>{
  try{
    console.log(req.body);
    const startdate=new Date(req.body.startdate)
    const enddate = new Date(req.body.enddate)
    const month = req.body.month;
    const startMonth= new Date(month);
    const endofmonth = new Date(month);
     endofmonth.setMonth(endofmonth.getMonth()+1);
    // const startMonth = new Date(req.body.month)
    // const endMonth = setMonth(new Date(req.body.month).getMonth()+1)  
    console.log(startMonth,"kfk",endofmonth);
    // const 
    let orderList 
    if (req.body.salesRe === 'Daily') {
       orderList = await Order.aggregate([
        {
          $match: {
            purchaseDate: {
              $gte: new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate()),
              $lt: new Date(enddate.getFullYear(), enddate.getMonth(), enddate.getDate() + 1)
            }
          }
        },
        {
          $unwind: '$orderItems' // Unwind the orderItems array
        },
        {
          $match: {
            'orderItems.orderStatus': 'delivered'
          }
        },
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
          $lookup: {
            from: 'products',
            localField: 'orderItems.product_id',
            foreignField: '_id',
            as: 'orderItems.product'
          }
        },
        {
          $unwind: '$orderItems.product'
        },
        {
          $group: {
            _id: '$_id',
            orderId: { $first: '$orderId' },
            totalAmount: { $first: '$totalAmount' },
            purchaseDate: { $first: '$purchaseDate' },
            user: { $first: '$user' },
            orderItems: { $push: '$orderItems' }
          }
        },
        {
          $sort: { purchaseDate: -1 }
        }
      ]);
    
      console.log(orderList, "*********Daily***********");
    }else if(req.body.salesRe === 'Monthly'){
      orderList = await Order.aggregate([
        {
          $match: {
            purchaseDate: {
              $gte: new Date(startMonth.getFullYear(), startMonth.getMonth(), startMonth.getDate()),
              $lt: new Date(endofmonth.getFullYear(), endofmonth.getMonth(), endofmonth.getDate() + 1)
            }
          }
        },
        {
          $unwind: '$orderItems' // Unwind the orderItems array
        },
        {
          $match: {
            'orderItems.orderStatus': 'delivered'
          }
        },
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
          $lookup: {
            from: 'products',
            localField: 'orderItems.product_id',
            foreignField: '_id',
            as: 'orderItems.product'
          }
        },
        {
          $unwind: '$orderItems.product'
        },
        {
          $group: {
            _id: '$_id',
            orderId: { $first: '$orderId' },
            totalAmount: { $first: '$totalAmount' },
            purchaseDate: { $first: '$purchaseDate' },
            user: { $first: '$user' },
            orderItems: { $push: '$orderItems' }
          }
        },
        {
          $sort: { purchaseDate: -1 }
        }
      ]);
    
      console.log(orderList, "**********Monthly**********");
    }else if(req.body.salesRe === 'Yearly'){
        const targetYear = req.body.year
        orderList = await Order.aggregate([
          {
            $match: {
              purchaseDate: {
                $gte: new Date(targetYear,0, 1),
                $lt: new Date(targetYear+1, 0, 1)
              }
            }
          },
          {
            $unwind: '$orderItems' // Unwind the orderItems array
          },
          {
            $match: {
              'orderItems.orderStatus': 'delivered'
            }
          },
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
            $lookup: {
              from: 'products',
              localField: 'orderItems.product_id',
              foreignField: '_id',
              as: 'orderItems.product'
            }
          },
          {
            $unwind: '$orderItems.product'
          },
          {
            $group: {
              _id: '$_id',
              orderId: { $first: '$orderId' },
              totalAmount: { $first: '$totalAmount' },
              purchaseDate: { $first: '$purchaseDate' },
              user: { $first: '$user' },
              orderItems: { $push: '$orderItems' }
            }
          },
          {
            $sort: { purchaseDate: -1 }
          }
        ]);
      
        console.log(orderList, "**********Yearly**********");

    }
    const doc = new PDFDocument();
    const filename = 'salesReport.pdf';
  
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);
  
    // Generate PDF content
    doc.fontSize(16).text('Sales Report', { align: 'center' }).moveDown(1);
    doc.text('--------------------------');
    
    orderList.forEach((item,index) => {
      function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
      
        return `${day}-${month}-${year}`;
      }
      const formattedPurchaseDate = formatDate(item.purchaseDate);

      const purchaser = item.user.name;
      const capitalizedPurchaser = purchaser.charAt(0).toUpperCase() + purchaser.slice(1);

            doc.text(`Order Id: ${item.orderId}`)
            doc.text(`Purchaser: ${capitalizedPurchaser}`)
            doc.text(`Purchase Email: ${item.user.email}`)
            doc.text(`Total Amount: ${item.totalAmount}`)
            doc.text(`Date of Delivery: ${formattedPurchaseDate}`)
            // doc.text(`Order Status: ${item.orderStatus}`)
            doc.text('--------------------------');
            doc.text( ' ')
            doc.text( ' ')
        })
    
  
    doc.end();

    // const workbook = new ExcelJS.Workbook();
    // const worksheet = workbook.addWorksheet('Report');
    
    // const filenamee = 'report.xlsx';
    // // Define columns in the Excel sheet
    // worksheet.columns = [
    //     { header: 'Order Id', key: 'orderId', width: 15 },
    //     { header: 'Purchaser', key: 'purchaser', width: 20 },
    //     { header: 'Purchase Email', key: 'purchaseEmail', width: 30 },
    //     { header: 'Total Amount', key: 'totalAmount', width: 15 },
    //     { header: 'Date of Delivery', key: 'deliveryDate', width: 20 },
    // ];
  
    // // Add data rows to the Excel sheet
    // orderList.forEach((item) => {
    //     worksheet.addRow({
    //         orderId: item.orderId,
    //         purchaser: item.user.name,
    //         purchaseEmail: item.user.email,
    //         totalAmount: item.totalAmount,
    //         purchaseDate: item.purchaseDate,
    //     });
    // });
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader('Content-Disposition', `attachment; filename="${filenamee}"`);
  
    // await workbook.xlsx.write(res);
    // res.end();
  
   
  
    
    
  }catch(err){
    console.error("postSalesReport --> ",err.message);
  }
}