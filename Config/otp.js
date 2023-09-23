const twilio = require('twilio');
const crypto = require('crypto');
require('dotenv').config()
const generateOTP = ()=>{
    const otpLength = 6;
    // Generate a random number between 10^5 (100,000) and 10^6 (1,000,000)
    const otp = crypto.randomInt(Math.pow(10,otpLength-1),Math.pow(10,otpLength))
    return otp.toString()
}
const otp = generateOTP()
// this will only send to my phone number 
module.exports.sendOTP=(phone)=>{
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
