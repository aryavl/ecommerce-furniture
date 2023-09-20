const User = require("../../model/userModel");

module.exports.getWallet=async(req,res)=>{
    try{
        const user = await User.find({})
    }catch(err){
        console.error("getWallet ====> ",err.message);
    }
}