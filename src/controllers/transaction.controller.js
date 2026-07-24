const transactionModel=require("../models/transaction.model")
const accModel=require("../models/account_models")
const mongoose=require("mongoose")
const ledgerModel = require("../models/ledger.model")
const emailService=require('../services/email.service')

async function createTransaction(req,res){

    /**
     * @description Validity of data sent by user
     */
    const{fromAccount,toAccount,amount,idempotencyKey}=req.body
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"Please, provide all the required fields to make a succesfull transaction."
        })
    }

    const user1=await accModel.findOne({
        _id:fromAccount
    })

    const user2=await accModel.findOne({
        _id:toAccount
    })

    if(!user1 || !user2){
        return res.status(400).json({
            message:"Provide valid account to make transaction"
        })
    }

    /**
     * @description validity of idempotency key (so that transaction happens one time only)
     */

    const isTransactionALreadyExist=await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    }) 

    if(isTransactionALreadyExist){
        if(isTransactionALreadyExist.status==='COMPLETED'){
            return res.status(200).json({
                message:"Transaction Successfull.",
                transaction:isTransactionALreadyExist
            })
        }
        if(isTransactionALreadyExist.status==='PENDING'){
            return res.status(200).json({
                message:"Transaction is still in processing.",
            })
        }
        if(isTransactionALreadyExist.status==='FAILED'){
            return res.status(500).json({
                message:"Transaction Failed !!!",
            })
        }
        if(isTransactionALreadyExist.status==='REVERSED'){
            return res.status(500).json({
                message:"Transaction was reverse , Please try again!!!",
            })
        }
       
    }

    /**
     * @description check account status if open or not it should not be frozen or closed
     */


    if(user1.status!=='ACTIVE' || user2.status!=='ACTIVE'){
        return res.status(500).json({
            message:"Account is not active. Try any other account!!!",
        })
    }

    /**
     * @description derive sender balance from ledger if sufficent balance or not
     */

    const balance=await user1.getBalance()

    if(balance<amount){
        return res.status(500).json({
            message:`Insufficient Balance in your account. Current balance is ${balance} . Requested amount to send is ${amount}`,
        })
    }

    /**
     * @description create transaction in pending state
     */


    const session=mongoose.startSession()
    session.startSession()


    const transaction=await transactionModel.create({
        fromAccount:fromAccount,
        toAccount:toAccount,
        amount:amount,
        idempotencyKey:idempotencyKey,
        status:"PENDING"
    },{session})


    /**
     * @description  create ledger entries
     */

    const debitLedgerEntry=await ledgerModel.create({
        account:user1,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    },{session})

    const creditLedgerEntry=await ledgerModel.create({
        account:user2,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    },{session})

    transaction.status='COMPLETED'
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    /**
     * @description send email 
     */

    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,user2)

    return res.status(201).json({
        message:"Transaction completed succesfully",
        transaction:transaction
    })
}




module.exports={createTransaction}