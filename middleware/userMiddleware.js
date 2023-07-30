const twilio = require('twilio')
const crypto = require('crypto')
const User = require('../model/userModel')
const userUtils = require('../utils/userUtils')
const { log } = require('console')
require('dotenv').config()


module.exports.isLoggedIn=(req,res,next)=>{
    if(req.session.userId){
        next()
    }else{
        res.redirect('/')
    }
}

module.exports.isLogin=(req,res,next)=>{
    if(req.session.userId){
        res.redirect('/')
    }else{
        next()
    }
}

const generateOTP = ()=>{
    const otpLength = 6;
    // Generate a random number between 10^5 (100,000) and 10^6 (1,000,000)
    const otp = crypto.randomInt(Math.pow(10,otpLength-1),Math.pow(10,otpLength))
    return otp.toString()
}
const sendOTP=(phone,otp)=>{
const message = `Your OTP is ${otp}. Please use it to complete your signup`
const accountSid = process.env.ACCOUNT_SID
    const authToken = process.env.AUTH_TOKEN
    const client = twilio(accountSid,authToken)
client.messages.create({
    body:message,
    from:"+14847598329",
    to:phone
})
.then(message=>console.log('OTP sent', message.sid))
.catch(error=>console.log("Error sending OTP:",error))
}

module.exports.otpVerify=async(req,res,next)=>{
    try{
        const {phone}=req.body
        // console.log(phone);
        const user = await User.findOne({phone})
        if(user){
            const otp =generateOTP()
            // console.log(otp);

            
           
            sendOTP(('+91' + phone),otp)
           // req.session.userId = user.email

            //save otp to users db
            userUtils.saveOtpToDatabase(phone,otp)
            
            next()
        }else{
            res.render('otpAuth',{message:"Enter valid phone number"})
        }
    }catch(e){
        console.log("error in otp page,",e.message);
    }
}
module.exports.otpValidate=async(req,res,next)=>{
    const userOtp = req.body.otp
   const user= User.findOne({otp:userOtp})
   if(user){
    next()
}else{
    //destroy session here
  res.render('otpAuth',{message:"Invalid OTP! Try again"})
}
  
}