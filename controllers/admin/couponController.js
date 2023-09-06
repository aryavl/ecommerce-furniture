const Coupon = require("../../model/couponModel");

module.exports.getCoupon = async(req,res)=>{
    try{
        const couponData = await Coupon.find({})
        console.log(couponData);
        res.render('couponMnagement',{couponData})
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
    }catch(err){
        console.error("postAddcoupon --->",err.message);
    }
}