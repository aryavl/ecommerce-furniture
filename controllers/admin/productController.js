const Category = require('../../model/categoryModel');

const fs = require('fs');
const Products = require('../../model/productModel');

module.exports.getProductList=async(req,res)=>{
    try{

        const pdt =await Products.find({})
        if(pdt){
            res.render('productManagement',{products:pdt})
        }
    }catch(err){
        console.error("getProductListerr",err.message);
    }
}
module.exports.getAddProduct = async (req, res) => {
    const categories = await Category.find({})
    // console.log(categories);
    res.render('addProduct',{categories:categories});
};

module.exports.postAddProduct = async (req, res) => {
    // console.log(req.body)
   
    try {
        
        const existing = await Products.findOne({ productName: req.body.productName });
       
        if (existing) {
            res.render('addProduct', { message: "Product already exists" });
        } else {
            const arrImages = [];
            for (let i = 0; i < req.files.length; i++) {
                arrImages[i] = req.files[i].filename;
            }
            const category = await Category.findOne({ categoryName: req.body.category });
            
           
            await Category.findOneAndUpdate({categoryName:req.body.category}, { $inc: { quantity: 1 } })

            
           const product = await Products.insertMany([{
                productName: req.body.productName,
                price: Number(req.body.price),
                stock: Number(req.body.stock),
                description: req.body.description,
                discount: req.body.discount,
                 category: category._id,
                images: arrImages
            }]);
            
            res.redirect('/admin/products');
        }
    } catch (err) {
        console.error("add product",err.message);
    }

  
};

module.exports.getEditProduct = async(req,res)=>{
    try{
        const id = req.query.id
        const product=await Products.findOne({_id:id})
        // console.log((product._id).toString());
        let pdtid=product._id.toString()
        let cat
         await Category.find({_id:product.category}).then(data=>data.forEach(item=>{cat=item.categoryName}))
        //  console.log(cat);
       
        const categories = await Category.find({},{categoryName:1});
        //  console.log(product);
        res.render('editProduct',{product:product,categoryName:cat,pdtid,categories:categories})
       }catch(err){
        console.error("getEditProduct",err.message);
       }
}

module.exports.deleteImages = async (req,res) => {
        try{
          let deleteimage = req.query.images;
          const id = req.query.id
          console.log(deleteimage);
          
          await Products.updateOne({}, { $unset: { images: deleteimage } });
          const product = await Products.findOne({_id : id});
          const categories = await Category.find({},{categoryName:1});
          res.render('editProduct',{product,categories});
        }
        catch(err){
          console.log("deleteImages",err.message);
        }
      }
    // not working
module.exports.postEditProduct=async(req,res)=>{
    const price= Number(req.body.price)
    const stock = Number(req.body.stock)
    
    try{
        const pdtId = req.body.productIdentity
        const arrImages = [];
        for (let i = 0; i < req.files.length; i++) {
        arrImages[i] = req.files[i].filename;
    }
    const imgs = await Products.find({_id:pdtId},{images:1})
    console.log(imgs);
        let data = await Products.updateOne({_id : pdtId},{$set : {productName: req.body.productName,
            price: price,
            stock: stock,
            description: req.body.description,
            discount: req.body.discount,
            category: req.body.category,
            images:arrImages
        }});
            
        res.redirect('/admin/products')
      }
      catch(err){
        console.log("postEditProduct",err.message);
      }
   
}
module.exports.getProductDelete = async(req,res)=>{
    try{
        const id = req.query.id

        const product = await Products.findOne({_id:id})
        await Category.findOneAndUpdate({_id:product.category}, { $inc: { quantity: -1 } })
        await Products.deleteOne({_id:id})
        res.redirect('/admin/products')
    }catch(err){
        console.error("getProductDelete",err.message);
    }
}
module.exports.getSearch = async(req,res)=>{
    const searchQuery = new RegExp("^" + req.body.search, "i"); // Adding "i" flag for case-insensitive search

    Products.find({ productName: { $regex: searchQuery } }).then((pdt) => {
      if (pdt.length === 0) {
        res.render('productManagement',{products:[]})

      } else {
        res.render('productManagement',{products:pdt})
      }
    });
  
}