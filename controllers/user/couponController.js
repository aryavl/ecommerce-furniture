const Coupon = require("../../model/couponModel");
const User = require("../../model/userModel");

module.exports.postCouponUpdate=async(req,res)=>{
    try{
        console.log(req.body);
        const couponId = req.body.couponId
        const user = await User.findOne({email:req.session.userId})
       console.log(user._id);
       
        // const coupon = await Coupon.findOneAndUpdate(
        //     { _id: couponId },
        //     {
        //       $push: { userId: user._id }
        //     },
        //     { new: true } // To return the updated document
        //   );
          
          // console.log("Updated Coupon:", coupon);
      
          return res.status(200).json({ success: true,couponId });
          
          
          

    }catch(err){
        console.error("postCouponUpdate ===>",err.message);
    }
}