const express = require('express')
const multer = require('multer')
const path = require('path')
const adminController = require('../../controllers/admin/adminController')
const userController = require('../../controllers/admin/userController')
const productController = require('../../controllers/admin/productController')
const categoryController = require('../../controllers/admin/categoryController')
const adminAuth = require('../../middleware/adminMiddleware')
const admin_route = express()
admin_route.use(express.json())
admin_route.use(express.urlencoded({ extended: true }))
admin_route.set("view engine", "ejs")
admin_route.set("views", "./views/admin")

const storage = multer.diskStorage({
    destination:function (req,file,cb) {
        return cb(null, "public/asset/uploads");
      },
      filename:function (req,file,cb) {
        const name = file.originalname

        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            console.log('hi')
            cb(null, name)
        }
    }
})


const upload = multer({storage:storage})


admin_route.get('/',adminController.getAdminLoginPage)

admin_route.post('/',adminAuth.isAdminLoggIn,adminController.postAdminLoginPage)

admin_route.get('/dashboard',adminAuth.isAdminLoggedIn,adminController.getAdminDashboard)

// user management
admin_route.get('/user',adminAuth.isAdminLoggedIn,userController.getUserList)

admin_route.get('/user/block',adminAuth.isAdminLoggedIn,userController.getBlockUser)

admin_route.get('/user/unblock',adminAuth.isAdminLoggedIn,userController.getUnBlockUser)

admin_route.post('/user/search',adminAuth.isAdminLoggedIn,userController.getSearch)

// product management

admin_route.get('/products',adminAuth.isAdminLoggedIn,productController.getProductList)

admin_route.post('/products', adminAuth.isAdminLoggedIn)

admin_route.get('/products/addProduct',adminAuth.isAdminLoggedIn,productController.getAddProduct)

admin_route.post('/products/addProduct',upload.array('file'), productController.postAddProduct)

admin_route.get('/products/edit',productController.getEditProduct)
// productController.postEditProduct
admin_route.post('/products/edit', upload.array('file'),productController.postEditProduct)

admin_route.get('/products/delete',productController.getProductDelete)

admin_route.get('/product/deleteimage',productController.deleteImages)

admin_route.post('/products/search',productController.getSearch)

// category management

admin_route.get('/category',adminAuth.isAdminLoggedIn,categoryController.getCategoryList)

admin_route.get('/category/addCategory',adminAuth.isAdminLoggedIn,categoryController.getCategoryAddCat)

admin_route.post('/category/addCategory', upload.single('file'), categoryController.postCategoryAddCat)

// category edit

admin_route.get('/category/edit',categoryController.getCategoryEditModal)

admin_route.post('/category/edit',categoryController.postCategoryListEdit)

// category add


admin_route.get('/delete',categoryController.getCategoryDelete)

admin_route.post('/search',categoryController.getSearch)


admin_route.get("/logout",(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
        // Redirect the user to the desired page after logout
        res.redirect('/admin')
      });
    
});
module.exports= admin_route