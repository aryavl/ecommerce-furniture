const User = require("../../model/userModel");
const mongoose = require('mongoose')
module.exports.getAddress = async(req,res)=>{
    try{
        const user = await User.findOne({email:req.session.userId})
        // console.log(user.address.items);
       res.render('address',{user:user,addressList:user.address.items})
    }catch(err){
        console.error("getaddress",err.message);
    }
}
module.exports.postAddress=async(req,res)=>{
    try{
        // console.log(req.session.userId);
        if(req.session.userId){
            const addressData= {
                name: req.body.name,
                phone:Number(req.body.phone),
                houseNumber:Number(req.body.houseNumber),
                pincode:Number(req.body.pincode),
                address:req.body.address,
                city:req.body.city,
                state:req.body.state,
                landmark:req.body.landmark,
                alternatePhone:Number(req.body.altPhone)
            }
            const address = await User.updateOne({email:req.session.userId},{$push: { "address.items": addressData}});
            res.redirect('/address')
        }
    }catch(err){
        console.error("postAddress",err.message);
    }
}
module.exports.getEditAddress = async (req, res) => {
    try {
        const id =  req.query.id
        // console.log(id);
        const user = await User.findOne({email:req.session.userId})
        const address=user.address.items
      
  
      // Execute the aggregation pipeline using the User model
     // const address = await User.aggregate(aggregationPipeline);
  
    //   console.log(address);
      const foundObject = address.find(obj => obj._id.toString() === id);
      if (foundObject) {
        // console.log("Found Object:", foundObject);
        res.render('editAddress', { user: user ,address:foundObject});
      } else {
        console.log("Object with the specified _id not found.");
      }
      // Fetch the user document from the 'User' collection
     
  
      // Render the 'editAddress' view template and pass the 'user' object as data
      
    } catch (err) {
      console.error("getEditAddress --> ", err.message);
      // Handle the error and send an appropriate response to the client
      res.status(500).send('Internal Server Error');
    }
  };
 
  module.exports.postEditAddress = async(req,res)=>{
    try{
      
        const id = req.body.id
        const user = await User.findOne({email:req.session.userId})
        const address=user.address.items
        const foundObject = address.find(obj => obj._id.toString() === id);
        foundObject.name=req.body.name
        foundObject.phone=req.body.phone
        foundObject.houseNumber=req.body.houseNumber
        foundObject.pincode=req.body.pincode
        foundObject.address=req.body.address
        foundObject.city=req.body.city
        foundObject.state=req.body.state
        foundObject.landmark=req.body.landmark
        foundObject.alternatePhone=req.body.alternatePhone
         await user.save();
        res.redirect('/editaddress')
      
    }catch(err){
        console.error("postEditAddress --->",err.message);
    }
  }

  module.exports.deleteAddress=async(req,res)=>{
try{
    const id= req.query.id
    console.log(id);
    const user = await User.findOne({email:req.session.userId})
    if (user) {
        // Use the filter method to create a new array without the object that matches the id
        user.address.items = user.address.items.filter((item) => item.id !== id);
      
        // Save the updated user with the modified address array
        await user.save();
        
    }else {
        console.log("User not found."); // Add this line for debugging
      }
  
    res.redirect('/address')
}catch(err){
    console.error("deleteAddress--->",err.message);
}
  }