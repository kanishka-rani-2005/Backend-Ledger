const userModel=require("../models/user.model")
const jwt=require("jsonwebtoken")
const cookie=require("cookie-parser")
const emailService=require("../services/email.service")

async function userRegisterController(req,res){

    const {email,name,password}=req.body

    if(!email || !password || !name){
        return res.status(400).json({
            message:"Please enter all required fields email,username,password.",
            status:"failed"
        })
    }

    const isExist=await userModel.findOne({
        email:email
    })

    if(isExist){
         return res.status(422).json({
            message:"Already exist user with this email",
            status:"failed"
        })
    }
    const user=await userModel.create({
        name:name,
        email:email,
        password:password
    })

    const jwtToken=jwt.sign({userId:user._id},process.env.JWT_SECRET_TOKEN,
        {
            expiresIn:"3d"
        }
    )

    res.cookie('token',jwtToken)
    
    res.status(201).json({
        message:"User Register Successfully.",
        user:{
            _id:user._id,
            name:user.username,
            email:user.email
        }
    })
    await emailService.sendRegistrationEmail(user.email,user.name)    
}

async function userLoginController(req,res){
    const {email,password}=req.body

    if(!email || !password ){
        return res.status(400).json({
            message:"Please enter all required fields email,password.",
            status:"failed"
        })
    }

    const user=await userModel.findOne({
        email:email
    }).select("+password");

    if(!user){
         return res.status(422).json({
            message:"Retry!!! User does not exist with this email and pasdword",
            status:"failed"
        })
    }

    const isValidPass=await user.comparePassword(password)

    if(!isValidPass){
        return res.status(400).json({
            message:"Invalid email or password.",
            status:"failed"
        })
    }

    const jwtToken=jwt.sign({userId:user._id},process.env.JWT_SECRET_TOKEN,
        {
            expiresIn:"3d"
        }
    )

    res.cookie('token',jwtToken)

    res.status(200).json({
        message:"User Login Successfully.",
        user:{
            _id:user._id,
            email:user.email
        }
    })
}




module.exports={
    userRegisterController,
    userLoginController
}