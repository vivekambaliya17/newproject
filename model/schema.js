const mongoose = require('mongoose');
let Schema = new mongoose.Schema({
    fullname:String,
    username:String,
    email:String,
    Pnumber:String,
    password:String,
    Confirmpassword:String,
    cart:Array

})

let sigupSchema = mongoose.model('sigup',Schema);
module.exports =sigupSchema;