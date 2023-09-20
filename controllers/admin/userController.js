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
        
  if (adminData) {
    const itemsPerPage = 6; // Set the desired number of items per page
    const currentPage = req.query.page ? parseInt(req.query.page) : 1;

    // Calculate the startIndex and endIndex to load exactly 'itemsPerPage' items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Query MongoDB to get only the users for the current page
    const users = await User.find({})
      .skip(startIndex)
      .limit(itemsPerPage);

    const totalItems = await User.countDocuments({}); // Get the total number of users

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    res.render('userManagement', {
      users: users,
      totalPages: totalPages,
      currentPage: currentPage,
    });
    
  
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
        const itemsPerPage = 6; // Set the desired number of items per page
            const currentPage = req.query.page ? parseInt(req.query.page) : 1;
            const totalItems = users.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            
            // Calculate the startIndex and endIndex to load exactly 'itemsPerPage' items
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            // Slice the array to get items for the current page, ensuring 'itemsPerPage' items
            const itemsToShow = users.slice(startIndex, endIndex);
        res.render('userManagement', { users: [],items: itemsToShow,
          totalPages: totalPages,
          currentPage: currentPage, });
      } else {
        const itemsPerPage = 6; // Set the desired number of items per page
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const totalItems = users.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Calculate the startIndex and endIndex to load exactly 'itemsPerPage' items
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Slice the array to get items for the current page, ensuring 'itemsPerPage' items
        const itemsToShow = users.slice(startIndex, endIndex);
    res.render('userManagement', { users,items: itemsToShow,
      totalPages: totalPages,
      currentPage: currentPage, });
      }
    });
  
}
