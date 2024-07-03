const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    Name:String,
    Pseudo:String,
    Bio:String,
    Sec:[],
    Email:String,
    Password:String,
    PostAccount:[],
    PicUrl:String,
    PubID:String
})

const User = mongoose.model("user", UserSchema)

module.exports = User