// const Admin = require("../../model/adminModel");
// const User = require("../../model/userModel");

const Admin = require("../../model/adminModel");
const User = require("../../model/userModel");

// module.exports.getUserList=async(req,res)=>{
//     try{
//         const adminData = await Admin.findOne({email:req.session.adminId})
//         // console.log(adminData);
//         if(adminData){
//             const users = await User.find({})
//             // console.log(users);
//             res.render('userListAdmin',{users:users})
        
//         }
//     }catch(err){
//         console.error("Error:", err);
//         res.send("An error occurred");
//     }
// }

// module.exports.getBlockUser= async (req, res) => {
//     try {
//        const userId = req.query.id;
//        console.log(userId);
//        const user = await User.findOneAndUpdate({ _id: userId }, { isBlocked: true });
//         res.redirect('/admin/adminDashboard/user')
//     } catch (e) {
//        console.error(e);
//     }
//  }

//  module.exports.getUnBlockUser= async (req, res) => {
//     try {
//        const userId = req.query.id;
//        console.log(userId);
//        const user = await User.findOneAndUpdate({ _id: userId }, { isBlocked: false });
//         res.redirect('/admin/adminDashboard/user')
//     } catch (e) {
//        console.error(e);
//     }
//  }
module.exports.getUserList = async(req,res)=>{
        try{
        const adminData = await Admin.findOne({email:req.session.adminId})
        // console.log(adminData);
        if(adminData){
            const users = await User.find({})
            // console.log(users);
            res.render('userManagement',{users:users})
        
        }
    }catch(err){
        console.error("getUserList", err.message);
        // res.send("An error occurred");
    }
}
module.exports.getBlockUser = async(req,res)=>{

  try {
       const userId = req.query.id;
       console.log(userId);
       const user = await User.findOneAndUpdate({ _id: userId }, { isBlocked: true });
        res.redirect('/admin/user')
    } catch (e) {
       console.error("getBlockUser",e.message);
    }
}
module.exports.getUnBlockUser = async(req,res)=>{
    try {
               const userId = req.query.id;
            //    console.log(userId);
               const user = await User.findOneAndUpdate({ _id: userId }, { isBlocked: false });
                res.redirect('/admin/user')
            } catch (e) {
               console.error("getUnBlockUser",e.message);
            }
}
module.exports.getSearch = async(req,res)=>{
    const searchQuery = new RegExp("^" + req.body.search, "i"); // Adding "i" flag for case-insensitive search

    User.find({ name: { $regex: searchQuery } }).then((users) => {
      if (users.length === 0) {
        res.render('userManagement', { users: [] });
      } else {
        res.render('userManagement', { users: users });
      }
    });
  
}
