
const userModel=require("../models/user.model")
const jwt=require("jsonwebtoken")


async function authMiddleware(req,res,next){

    const token=req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(400).json({
            message:"Unauthorized Access , Token is missing!!!"
        })
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_TOKEN)
        const user = await userModel.findOne({ _id: decoded.userId })
        req.user=user
        return next()

    }catch(err){
        console.log(err)
        return res.status(400).json({
            message:"Unauthorized Access , Token is invalid!!!"
        })
    }

}

async function authSystemUserMiddleware(req,res,next){
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(400).json({
            message:"Unauthorized Access , Token is missing!!!"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_TOKEN)
        const user = await userModel.findOne({ _id: decoded.userId }).select('+systemUser')
        
        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden access, not a system user"
            })
        }
        
        req.user=user
        return next()

    }catch(err){
        console.log(err)
        return res.status(400).json({
            message:"Unauthorized Access , Token is invalid!!!"
        })
    }

}

module.exports={authMiddleware,authSystemUserMiddleware}