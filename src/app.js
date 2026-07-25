const express=require("express")
const cors = require("cors")
const authRouter=require("./routes/auth.routes")
const accRouter=require("./routes/account.routes")
const cookieParser = require("cookie-parser")
const transactionRoutes = require("./routes/transaction.routes")


const app=express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/accounts",accRouter)
app.use('/api/transactions',transactionRoutes)

module.exports=app