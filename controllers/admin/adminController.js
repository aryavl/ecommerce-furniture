const Admin = require("../../model/adminModel")
const bcrypt = require('bcrypt')
const User = require("../../model/userModel")
module.exports.getAdminLoginPage =(req,res)=>{
    // console.log("admin");
    res.render('adminLogin')
    }
module.exports.postAdminLoginPage =async(req,res)=>{
    const {email,password}=req.body
    // console.log(email);
    try{
        const admin =await Admin.findOne({})
        // console.log(admin);
        if(admin){
             const matchPass =  bcrypt.compare(password,admin.password)
                if(matchPass){
                    req.session.adminId = email
                    res.redirect('/admin/dashboard')
                }  
        }else{
            res.render('adminLogin',{message:"Credentials don't exists"})
        }
    }catch(e){
        console.error(e);
    }
    }
    module.exports.getAdminDashboard = async(req,res)=>{
        res.render('adminHomepage')
    }

 
