const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    UserID:String,
    Titre:String,
    Desc:String,
    Tags:[],
    Commentaire:[],
    Like:[],
    Images:[],
    Date:String
})

const Post = mongoose.model("posts", PostSchema)

module.exports = Post