const Banner = require("../../model/bannerModel");

module.exports.getBanner=async(req,res)=>{
    try{
        
        const banner = await Banner.aggregate([
            {
              $match: {
                isList: true
              }
            }
          ]);
          console.log(banner);
        if(banner){
            res.render('bannerManagement',{banner:banner})
        }
       
    }catch(err){
        console.error("getBanner --->",err.message);
    }
}
module.exports.getAddBanner=async(req,res)=>{
    try{
        
        res.render('addBanner')
    }catch(err){
        console.error("getAddBanner --->",err.message);
    }
}
module.exports.getPostAddBanner=async(req,res)=>{
    try{
        console.log(req.body);
         
        const existing = await Banner.findOne({ bannerName: req.body.bannerName });
       
        if (existing) {
            res.render('addBanner', { message: "Banner already exists" });
        } else {
           const banner = await Banner.insertMany([{
            bannerName: req.body.bannerName,
            title: req.body.title,
            subtitle: req.body.subtitle, 
            image: req.file.filename
            }]);
            
            res.redirect('/admin/banner')

    }}catch(err){
        console.error("getAddBanner --->",err.message);
    }
}

module.exports.getBannerDelete=async(req,res)=>{
    try{
        const id = req.query.id
            
        await Banner.findOneAndUpdate({_id:id},{$set:{isList:false}})

        res.redirect('/admin/banner')
    }catch(err){
        console.error("getBannerDelete -------->",err.message);
    }
}
module.exports.getBannerSearch=async(req,res)=>{
    try{
        const searchQuery = new RegExp("^" + req.body.search, "i"); // Adding "i" flag for case-insensitive search
console.log(req.body.search);
        Banner.find({ bannerName: { $regex: searchQuery },isList:true }).then((item) => {
          if (item.length === 0) {
            res.render('bannerManagement',{banner:[]})
          } else {
            res.render('bannerManagement',{banner:item})
          }
        });
    }catch(err){
        console.error("getBannerSearch ===> ",err.message);
    }
}