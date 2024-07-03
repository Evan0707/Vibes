const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    UserID:String,
    PostID:String,
    Content:String,
    Date:String
})

const Comment = mongoose.model("comment", CommentSchema)

module.exports = Comment