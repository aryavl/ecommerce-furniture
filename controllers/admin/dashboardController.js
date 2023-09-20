module.exports.postGraph=async(req,res)=>{
    try{
        console.log("***********",req.body);
    }catch(err){
        console.error("postGraph====>",err.message);
    }
}