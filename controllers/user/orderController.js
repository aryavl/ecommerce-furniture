const Order = require("../../model/orderModel");
const Products = require("../../model/productModel");
const User = require("../../model/userModel");



module.exports.getOrders = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.session.userId });
        const orders = await Order.find({ user: user._id },{isList:true});
console.log(orders);
        const productDetail = [];

        // Use a for...of loop to allow asynchronous operations inside
        for (const orderItem of orders) {
            for (const item of orderItem.orderItems) {
                const product = await Products.findOne({ _id: item.product });
        
                if (product) {
                    const orderDetail = {
                        productName: product.productName,
                        quantity: item.quantity,
                        price: product.price,
                        images: product.images,
                    };
                    productDetail.push(orderDetail);
                }
            }
        }
console.log(productDetail);
        res.render('orders', { user: user, orderItem: orders, productDetail: productDetail });
    } catch (err) {
        console.error("getOrders", err.message);
    }
};
