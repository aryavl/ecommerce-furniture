const Coupon = require("../../model/couponModel");

module.exports.getCoupon = async(req,res)=>{
    try{
        
        const coupon = await Coupon.aggregate([
            {
              $match: {
                isList: true
              }
            }
          ]);
          console.log(coupon);
        if(coupon){
            const itemsPerPage = 6; // Set the desired number of items per page
            const currentPage = req.query.page ? parseInt(req.query.page) : 1;
            const totalItems = coupon.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            
            // Calculate the startIndex and endIndex to load exactly 'itemsPerPage' items
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            // Slice the array to get items for the current page, ensuring 'itemsPerPage' items
            const itemsToShow = coupon.slice(startIndex, endIndex);
            res.render('couponMnagement',{couponData:coupon,items: itemsToShow,
                
                totalPages: totalPages,
                currentPage: currentPage,})
        }
    }catch(err){
        console.error("getCoupon --->",err.message);
    }
}
module.exports.getAddcoupon = async(req,res)=>{
    try{
        const CouponData = await Coupon.find({ isList: true });
        res.render('addCoupon',{CouponData})
    }catch(err){
        console.error("getAddcoupon --->",err.message);
    }
}
module.exports.getEditCoupon = async(req,res)=>{
    try{
        const id = req.query.id
        console.log(id);
        const couponData = await Coupon.find({ _id:id });
        console.log("edit",couponData);
        res.render('editCoupon',{couponData})
    }catch(err){
        console.error("getAddcoupon --->",err.message);
    }
}
module.exports.postAddcoupon = async(req,res)=>{
    try{
        const formdata = req.body;
        console.log(formdata);
        const couponData = await Coupon.insertMany([{
            couponName: formdata.coupon_name,
            couponValue: formdata.offer,
            expiryDate: formdata.expiry_date,
            maxValue: formdata.max_value,
            minValue: formdata.min_value,
            
          }]);
          res.redirect('/admin/coupon')

    }catch(err){
        console.error("postAddcoupon --->",err.message);
    }
}

module.exports.postEditCoupon=async(req,res)=>{
    try{
        console.log(req.body);
        
        const coupon =await Coupon.findOneAndUpdate({_id:req.body.id},{
        
            couponName:req.body.coupon_name,
            couponValue:Number(req.body.offer),
            minValue:Number(req.body.min_value),
            maxValue:Number(req.body.max_value),
            expiryDate:req.body.expiry_date
        })
    res.redirect('/admin/coupon')

    }catch(err){
        console.error("postEditCoupon ====> ",err.message);
    }
}

module.exports.getCouponDelete=async(req,res)=>{
    try{
        const id = req.query.id
        console.log(id);
    await Coupon.findOneAndUpdate({_id:id},{$set:{isList:false}})

    res.redirect('/admin/coupon')
    }catch(err){
        console.error("getCouponDelete ====> ",err.message);
    }
}