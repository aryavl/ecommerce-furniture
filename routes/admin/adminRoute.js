const express = require("express");

const adminController = require("../../controllers/admin/adminController");
const userController = require("../../controllers/admin/userController");
const productController = require("../../controllers/admin/productController");
const categoryController = require("../../controllers/admin/categoryController");
const orderController = require("../../controllers/admin/orderController");
const salesController = require("../../controllers/admin/salesController");
const couponController = require("../../controllers/admin/couponController");
const bannerController = require("../../controllers/admin/bannerController");
const adminAuth = require("../../middleware/adminMiddleware");
const multer = require("../../middleware/multer");
const admin_route = express();
admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));
admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");
const errorHandle = require("../../middleware/errorHandle");

admin_route.get("/", adminController.getAdminLoginPage);

admin_route.post(
  "/",
  adminAuth.isAdminLoggIn,
  adminController.postAdminLoginPage
);

admin_route.get(
  "/dashboard",
  adminAuth.isAdminLoggedIn,
  adminController.getAdminDashboard
);

// user management
admin_route.get("/user", adminAuth.isAdminLoggedIn, userController.getUserList);

admin_route.get(
  "/user/block",
  adminAuth.isAdminLoggedIn,
  userController.getBlockUser
);

admin_route.get(
  "/user/unblock",
  adminAuth.isAdminLoggedIn,
  userController.getUnBlockUser
);

admin_route.post(
  "/user/search",
  adminAuth.isAdminLoggedIn,
  userController.getSearch
);

// product management

admin_route.get(
  "/products",
  adminAuth.isAdminLoggedIn,
  productController.getProductList
);

admin_route.post("/products", adminAuth.isAdminLoggedIn);

admin_route.get(
  "/products/addProduct",
  adminAuth.isAdminLoggedIn,
  productController.getAddProduct
);

admin_route.post(
  "/products/addProduct",
  multer.upload.array("file"),
  productController.postAddProduct
);

admin_route.get(
  "/products/edit",
  errorHandle.errorHandler,
  productController.getEditProduct
);
// productController.postEditProduct
admin_route.post(
  "/products/edit",
  multer.upload.array("file"),
  productController.postEditProduct
);

admin_route.get("/products/delete", productController.getProductDelete);

admin_route.get("/product/deleteimage", productController.deleteImages);

admin_route.post("/products/search", productController.getSearch);

// category management

admin_route.get(
  "/category",
  adminAuth.isAdminLoggedIn,
  categoryController.getCategoryList
);

admin_route.get(
  "/category/addCategory",
  adminAuth.isAdminLoggedIn,
  categoryController.getCategoryAddCat
);

admin_route.post(
  "/category/addCategory",
  multer.upload.single("file"),
  categoryController.postCategoryAddCat
);

// category edit

admin_route.get("/category/edit", categoryController.getCategoryEditModal);

admin_route.post("/category/edit", categoryController.postCategoryListEdit);

admin_route.get("/category/delete", categoryController.getCategoryDelete);

admin_route.post("/category/search", categoryController.getSearch);

// order management
admin_route.get(
  "/order",
  adminAuth.isAdminLoggedIn,
  orderController.getOrderList
);

// order details
admin_route.get(
  "/order/admindetails",
  adminAuth.isAdminLoggedIn,
  orderController.getOrderDetails
);
// cancel order
admin_route.post("/cancelOrder", orderController.postCancelOrder);

// admin_route.get('/orderUpdate',adminAuth.isAdminLoggedIn,orderController.getOrderUpdate)

admin_route.post("/orderUpdate", orderController.postOrderUpdate);

// order filter

admin_route.post('/filter-order',orderController.postFilterOrder)

// sales report

admin_route.get("/sales-report", salesController.getSalesReport);

admin_route.post("/report-order", salesController.postReport);



// coupon management
admin_route.get("/coupon", couponController.getCoupon);
admin_route.get("/addcoupon", couponController.getAddcoupon);
admin_route.post("/addcoupon", couponController.postAddcoupon);
admin_route.get("/editCoupon", couponController.getEditCoupon);


// banner management
admin_route.get('/banner',bannerController.getBanner)

admin_route.get('/banner/addBanner',bannerController.getAddBanner)

admin_route.post('/banner/addBanner',multer.upload.single("file"),bannerController.getPostAddBanner)

admin_route.get('/banner/delete',bannerController.getBannerDelete)

admin_route.post('/banner/search',bannerController.getBannerSearch)











admin_route.get("/logout", (req, res) => {
  
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    // Redirect the user to the desired page after logout
    res.redirect("/admin");
  });
});
module.exports = admin_route;
