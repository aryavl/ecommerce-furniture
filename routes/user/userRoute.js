const express= require("express")
const userAuth = require('../../middleware/userMiddleware')
const user_route = express()
const userController = require('../../controllers/user/userController')
const productDetailController = require('../../controllers/user/productDetailController')


user_route.set("views", "./views/user")


user_route.get('/', userController.getHome)

user_route.get('/login',userAuth.isLogin,userController.getLogin)


user_route.post('/login',userAuth.isLogin,userController.postLogin)

user_route.get('/signup',userAuth.isLogin,userController.getSignup)

user_route.post('/signup',userAuth.isLogin,userController.postSignup)

// otp page
user_route.get('/otpLogin',userAuth.isLogin, userController.getOtp)

user_route.post('/otpLogin',userAuth.otpVerify, userController.postOtp)

 user_route.get('/otpVerify',userAuth.isLogin, userController.getOtpVerify)

 user_route.post('/otpVerify',userAuth.otpValidate, userController.postOtpVerify)

// forgot
user_route.get('/forgot',userController.getForgot)

user_route.post('/forgot',userController.postForgot)

user_route.get('/resetPassword',userController.getResetPassword)

user_route.post('/resetPassword',userController.postResetPassword)
// user home

// product detail

user_route.get('/product-detail',productDetailController.getProductDetail)

user_route.post('/product-detail', productDetailController.postCartItem);

user_route.get('/profile',userController.getProfile)

// post cart field to User collection
// to redirect to product detail when a product is added to cart
// user_route.post('/product-detail',productDetailController.postCartItem)



user_route.post('/add-to-cart',productDetailController.postAddTocart)

user_route.get('/products',productDetailController.getProductList)

user_route.get('/address',productDetailController.getAddress)

user_route.get('/checkout',productDetailController.getCheckout)

user_route.get('/confirm-order',productDetailController.getConfirmOrder)

user_route.get('/cart',userController.getCart)


// update Cart Quantity
user_route.post('/updateQuantity',userController.updateCart)
user_route.post('/cart',userController.postCart)


  



user_route.get('/logout',(req,res)=>{
    req.session.userId = null
    res.redirect('/')
})

module.exports = user_route