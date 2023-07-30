const Category = require('../../model/categoryModel');
const User = require('../../model/userModel');



module.exports.getCategoryList=async(req,res)=>{
    try{

        const cat =await Category.find({})
       
        if(cat){
            res.render('categoryManagement',{categories:cat})
        }
    }catch(err){
        console.error("getCategoryList",err);
    }
}
module.exports.getCategoryDelete = async(req,res)=>{
    try{
        const id = req.query.id
        await Category.deleteOne({_id:id})
        res.redirect('/admin/category')
    }catch(err){
        console.error(err);
    }
}
module.exports.getCategoryEditModal = async(req,res)=>{
   
   try{
    const id = req.query.id
    const category=await Category.findOne({_id:id})
    // console.log(category);
    res.render('editCategory',{category:category})
   }catch(err){
    console.error(err);
   }
}
module.exports.postCategoryListEdit = async(req,res)=>{
   
    try{
        const catId = req.query.id
    console.log(catId);
    const category =await Category.findOneAndUpdate({_id:catId},{
        
        categoryName:req.body.categoryName,
        image:req.file.filename
    })
    res.redirect('/admin/category')
    }catch(err){
        console.error(err);
    }
}

module.exports.getCategoryAddCat=async(req,res)=>{
    res.render('addCategory')
}

module.exports.postCategoryAddCat = async(req,res)=>{
    // console.log(req.body)
   console.log(req.file.filename);
    try {
        
        const existing = await Category.findOne({ categoryName: req.body.categoryName });
       
        if (existing) {
            res.render('addCategory', { message: "Category already exists" });
        } else {
            // const arrImages = [];
            // for (let i = 0; i < req.files.length; i++) {
            //     arrImages[i] = req.files[i].filename;
            // }
            
            
           


            
           const category = await Category.insertMany([{
            categoryName: req.body.categoryName,
            description: req.body.description,
                
                image: req.file.filename
            }]);
            
            res.redirect('/admin/category')
        }
    } catch (err) {
        console.error("add product",err.message);
    }

    
    // try{
    //     console.log(req.body.categoryName);
    //     const existing =await Category.findOne({categoryName:req.body.categoryName})
    //     console.log("existing",existing);
    //     if(existing){
            
    //              res.render('addCategory',{message:"Category already exists"})
           
    //     }else {
    //         // await Category.insertMany([{
               
    //         //     categoryName:req.body.categoryName,
    //         //     description:req.body.description,
    //         //     image:req.file.filename
    //         // }])
    //          res.redirect('/admin/category')
           
    //     }
        
    // }catch(err){
    //     console.error(err);
    // }
}
module.exports.getSearch = async(req,res)=>{
    const searchQuery = new RegExp("^" + req.body.search, "i"); // Adding "i" flag for case-insensitive search

    Category.find({ categoryName: { $regex: searchQuery } }).then((cat) => {
      if (cat.length === 0) {
        res.render('categoryManagement',{categories:[]})
      } else {
        res.render('categoryManagement',{categories:cat})
      }
    });
  
}