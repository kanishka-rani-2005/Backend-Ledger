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

async function getUserAccountsController(req,res){
    const accounts=await accModel.find({user:req.user._id})

    res.status(200).json({
        message:"Account fetched successfully",
        accounts
    })
}

async function getAccountBalanceController(req,res){
    const {accountId}=req.params

    const acc=await accModel.findOne({
        _id:accountId,
        user:req.user._id
    })

    if(!acc){
        res.status(500).json({
            message:"Account not found",
        })
    }

    const balance=await acc.getBalance()

    return res.status(200).json({
        accountId:acc._id,
        balance:balance
    })
}



module.exports={createAccountContoller,getUserAccountsController,getAccountBalanceController}