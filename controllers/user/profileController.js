const User = require("../../model/userModel");

module.exports.postUserEdit=async(req,res)=>{
    try{
        //user name
        console.log(req.body);
        const editedValue= req.body.editedValue
        const msg= req.body.msg
        if(msg==='phone'){

            const user = await User.findOneAndUpdate({email:req.session.userId},{$set:{phone:Number(req.body.editedValue)}})
            console.log(user);
        }else if(msg==='name'){
            const user = await User.findOneAndUpdate({email:req.session.userId},{$set:{name:req.body.editedValue}})
            console.log(user);
        }
        
    }catch(err){
        console.error('postUserEdit =====> ',err.message);
    }
}