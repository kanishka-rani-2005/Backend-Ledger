const mongoose = require("mongoose");
require("dotenv").config()

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("MongoDB Connected");
        })
        .catch((err) => {
            console.error("MongoDB Connection Error:", err.message);
            process.exit(1);
        });
}

module.exports = connectDB;