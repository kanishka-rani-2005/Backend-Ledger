const express=require("express")

const authMiddleware=require('../middleware/auth.middleware')
const router=express.Router();
const accController=require("../controllers/acc.controller")


/**
 * @route /api/accounts/
 * @description create new account
 * @protected
 */
router.post('/',authMiddleware.authMiddleware,accController.createAccountContoller)


module.exports=router