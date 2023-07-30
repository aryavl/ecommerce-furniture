const Category = require("../../model/categoryModel");
const Products = require("../../model/productModel");
const User = require("../../model/userModel");
const bcrypt = require('bcrypt')


const securePassword = async(pass)=>{
    try{
        const passHash = await bcrypt.hash(pass,10)
        return passHash
    }catch(e){
        console.log("password err",err);
    }
}
module.exports.getLogin = async(req,res)=>{
    res.render('login')
}

module.exports.getOtp= async(req,res)=>{
    res.render('otpAuth')
}
module.exports.getHome=async(req,res)=>{
    try{
        // console.log("home",req.session);
        const user =await User.findOne({email:req.session.userId})
        const products = await Products.find({})
    
        const categories = await Category.find({})
            console.log("hi guest home");

        res.render('home',{user:user,products:products,category:categories})

      //  const isUserHasCart= await User.findOne({email:req.session.userId},{cart:1})
        // console.log("cartlength",isUserHasCart.cart.length);
        // if(user){
        //     console.log("hi user home");
        //     res.render('home',{user:user,products:products,category:categories})
        // }else{

        //     console.log("hi guest home");
        //      res.render('home',{user:user,products:products,category:categories})
        // }
            
          

    }catch(e){
        console.error("getHome",e.message);
    }
}

module.exports.getCart=async(req,res)=>{

    const getCartItems = async (user) => {
        const cartData = [];
        for (const item of user.cart) {
        const user =await User.findOne({email:req.session.userId})
          const product = await Products.findOne({ _id: item.productId });
          if (product) {
            cartData.push({user:user, count: item.count, product: product });
          }
        }
        return cartData;
      };
      
      try {
        if (req.session.userId) {

          const user = await User.findOne({ email: req.session.userId }, { cart: 1, _id: 0 });
      
          if (user) {
            const cartData = await getCartItems(user);
    //   [{count,product}]
            const uniqueCartItems = cartData.filter((item, index, self) =>
              index === self.findIndex(t => t.product && t.product._id.equals(item.product._id))
            );
      
            res.render('cart', { user:user,cartItem: uniqueCartItems });
          } else {
            console.error("getCart: User not found");
            return res.status(404).send("User not found");
          }
        }
      } catch (e) {
        console.error("getCart", e.message);
        return res.status(500).send("Internal Server Error");
      }
      
      
      
      
}
module.exports.getSignup = async(req,res)=>{
    res.render('signup')
}
module.exports.postLogin = async(req,res)=>{
    try{
        const {email,password,phone}=req.body
        const user = await User.findOne({email})
        if(user){
            const matchPass =  bcrypt.compare(password,user.password)
            if(matchPass){
               if(user.isBlocked){
               res.render('login',{message:"You are blocked"})
               }else{
                req.session.userId = user.email
                res.redirect('/')
               
               }
            }else{
            res.render('login',{message:"please enter valid credentials"})

            }
        }else{
            res.render('login',{message:"Please Enter the registered email and password"})
        }
    }catch(err){
        console.log("postLogin",err.message);
    }

}
module.exports.postSignup=async(req,res)=>{
    
    try{
        const {name,email,password,phone,confirmpassword}=req.body
        let existing = await User.find({$or:[{email:email},{phone:phone}]})

      
        if(existing.length === 0){
            if(confirmpassword !== password){
                res.render('signup',{message:"Password do not match"})
            }else if(!phone.match(/^[6789]\d{9}$/)){
                res.render('signup',{message:"Invalid mobile number"})
            }else{
                const bcryptPass = await securePassword(password)
                User.insertMany([{
                    name:name,
                    email:email,
                    password:bcryptPass,
                    phone:phone
                }])
                console.log("user created successfully");

                res.redirect('/otpLogin')
            }
        
    }else{
        res.render('signup',{message:"User already exists"})
    }
    }catch(e){
        console.log("postSignup",e.message);
    }
    
}

module.exports.postOtp=async(req,res)=>{
    res.redirect('/otpVerify')

}
module.exports.getOtpVerify=async(req,res)=>{
    res.render('otpVerify')

}
module.exports.postOtpVerify=async(req,res)=>{
    const userOtp = req.body.otp
    const user =await User.findOne({otp:userOtp})
    // const user =await User.findOne({otp:userOtp},{$unse})
    console.log("otpverify",req.session);
    const products = await Products.find({})
    const categories = await Category.find({})
    if(user){
         user.otp = 0
         req.session.userId = user.email
      res.redirect('/')
    //    res.render('home',{user:user,products:products,category:categories})

    }
}

module.exports.getForgot=async(req,res)=>{
    res.render('forgot')
}
module.exports.postForgot=async(req,res)=>{
    const userEmail = req.body.email
    // generate a password reset token
    const resetToken = userUtils.generateToken()
    // save the reset token to user database
    userUtils.saveResetTokenToDatabase(userEmail,resetToken)

    // create a transport obj using nodemailer
    const transporter = nodemailer.createTransport({
        host:'gmail',
        auth:{
            user:'aryalechu98@gmail.com',
            // pass:process.env.EMAIL_PASSWORD,
            
        }
    })

    // compose email
    const mailOptions = {
        from : 'aryalechu98@gmail.com',
        to:userEmail,
        subject:"Password Reset",
        text:`Click the following link to reset your password :http://localhost:3002/resetPassword?token=${resetToken}`
    }
    // send the mail
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.error(error.message);
            res.render('forgot',{message:"Error sending password reset email"})
        }else{
            console.log('Email sent: ' + info.response);
            res.render('forgot',{emailLink:true})
        }
    })
}
module.exports.getResetPassword=(req,res)=>{
    const resetToken = req.query.token
    // verify the token against the stored token in userdatabase
    if(resetToken){
      const user=  User.findOne({resetToken:resetToken})
      if(user){
          res.render('resetPass')
      }else{
        res.render('forgot',{message:"Invalid or expired rest token. Try again!"})
      }
    }else{
        res.render('forgot',{message:"Invalid or expired rest token. Try again!"})
    }
}
module.exports.postResetPassword=async(req,res)=>{
    const resetToken = req.query.token;
    const newPassword = req.body.newPassword
    const confirmPassword = req.body.confirmPassword

    // verify the token against the stored tokens
    if(resetToken){
     const user=   User.findOne({resetToken:resetToken})
     if(user){
        //validate the new password and confirm password
        if(newPassword === confirmPassword){
            // update the user's password in the database
            user.password = newPassword;
            // clear the reset token
            user.resetToken = undefined
            user.save((error)=>{
                if(error){
                    console.error(error);
                }else{
                    //  redirect to login page and display success message 
                    res.render('login',{passwordMessage:"Password reset successfully"})
                }
            })
        }else{
            // handle password mismatch error
            res.render('resetPass',{message:"New password and confirm password do not match"})
        }
     }
    }else{
         // Handle missing token
        res.render('resetPass',{message:"Invalid reset token"})

    }

}


// try{}catch(e){console.error(e.message);}

module.exports.getProfile= async(req,res)=>{
    try{
        res.render('profile')
    }catch(err){
        console.error("getProfile",err.message);
    }
}
module.exports.postCart=async(req,res)=>{
    try{
        const { productId, count } = req.body;
        console.log("Message received from frontend:", productId, count, req.session.userId);
    }catch(err){
        console.error("postCart",err.message);
    }
}
module.exports.updateCart = async(req,res)=>{
   
    try{
        const { productId, count } = req.body;
        console.log("Message received from frontend:", productId, count, req.session.userId);
        
        const product = await Products.findOne({ _id: productId });
        
        if (req.session.userId) {
          const user = await User.findOne({ email: req.session.userId }, { cart: 1, _id: 0 });
          let data = user;
          let { cart } = data;

        
          let found = false;
        
          for (const item of cart) {
            const { productId } = item;
            if (productId === req.body.productId) {
              found = true;
              break;
            }
          }
        
          if (found) {
            if(count>product.stock){
                res.send(JSON.stringify({message: "Out of Stock",exceed:true }));
            }else{
                await User.updateOne(
                    { email: req.session.userId, "cart.productId": req.body.productId },
                    { "cart.$.count": parseInt(count)  } // Increment the count by the given value
                  );
                
                res.send(JSON.stringify({message: "quantity incremented",exceed:false }))
            }
           
          } 
           
           
          
        }
        else if(req.session.userId === undefined){
                res.render('productDetail',{product,message:"Please Login"})
            }
               
    }catch(err){
        console.error("updateCart",err.message);
    }
}