const express= require("express")
const userAuth = require('../../middleware/userMiddleware')
const user_route = express()
const userController = require('../../controllers/user/userController')
const productDetailController = require('../../controllers/user/productDetailController')
const addressController = require('../../controllers/user/addressController')
const orderController = require('../../controllers/user/orderController')
const productController = require('../../controllers/user/productContoller')
const filterCatController = require('../../controllers/user/filterCatController')


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

user_route.post('/add-to-cart',productDetailController.postAddTocart)



// address managment
user_route.get('/address',addressController.getAddress)

user_route.post('/address',addressController.postAddress)

user_route.get('/editaddress',addressController.getEditAddress)

user_route.post('/editaddress',addressController.postEditAddress)

user_route.get('/deleteaddress',addressController.deleteAddress)

user_route.get('/checkout',productDetailController.getCheckout)

user_route.post('/checkout',productDetailController.postCheckout)

user_route.get('/confirm-order',userAuth.isCheckout,productDetailController.getConfirmOrder)

user_route.get('/cart',userController.getCart)

user_route.post('/cart',userController.postCart)

user_route.get('/cartDelete',userController.getCartDelete)

// profile managment
user_route.get('/profile',userController.getProfile)

// update Cart Quantity
user_route.post('/updateQuantity',userController.updateCart)
//  Order management
user_route.get('/orders',orderController.getOrders)
// all product
user_route.get('/product',productController.getProducts)
// filter categories on home page
user_route.get('/filter-cat',filterCatController.getFilterCat)



user_route.get('/logout',(req,res)=>{
    req.session.userId = null
    res.redirect('/')
})

module.exports = user_route