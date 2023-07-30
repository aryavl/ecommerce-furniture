const crypto = require('crypto')
const bcrypt = require('bcrypt')
const User = require('../model/userModel')
module.exports.generateToken=()=>{
    const token = crypto.randomBytes(32).toString('hex')
    return token
}
module.exports.saveResetTokenToDatabase=async(email,resetToken)=>{
  const user= await  User.findOneAndUpdate({email:email},{resetToken:resetToken})
  if(user){
    console.log("Reset token saved to user's record ");
  }
}
module.exports.saveOtpToDatabase=async(phone,otp)=>{
  const user= await  User.findOneAndUpdate({phone:phone},{otp:otp})
  if(user){
    console.log("otp is saved to user's record ");
  }
}
module.exports.securePassword = async(pass)=>{
  try{
      const passHash = await bcrypt.hash(pass,10)
      return passHash
  }catch(e){
      console.log("password err",err);
  }
}
// db.once('open',async()=>{
//   const bcryptPass = await userUtilis.securePassword(password)
//   try{
//       const adminUser = await Admin.create({
//           email:'admin@gmail.com',
//           password:bcryptPass
//       })
//       console.log("Admin user created");
//       process.exit(0)
//   }catch(e){
//       console.error('failed to create admin user',error);
//       process.exit(1)
//   }
// })