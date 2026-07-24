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

router.get('/',authMiddleware.authMiddleware,accController.getUserAccountsController)

/**
 * @route /api/accounts/balance/:accountId
 * @description find balance per account
 * @protected
 */
router.get('/balance/:accountId',authMiddleware.authMiddleware,accController.getAccountBalanceController)

module.exports=router