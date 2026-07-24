const accModel=require("../models/account_models")
const emailService=require('../services/email.service')

async function createAccountContoller(req,res){

    const user=req.user
    const acc=await accModel.create({
        user:user._id
    })

    res.status(201).json({
        message:"Account Created succesfully",
        acc:acc
    })
    await emailService.accountCreationSucessfully(user.email,user.name)
}

module.exports={createAccountContoller}