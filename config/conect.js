const mongoose = require('mongoose')
require('dotenv').config()
console.log(process.env.DB)
let connect = async()=>{
    try {
        console.log("running");
        await mongoose.connect(process.env.DB)
        console.log("db connected");
    } catch (error) {
        console.log(error);
    }
} 
module.exports = connect