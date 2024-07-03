const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
    Follower:String,
    Following:String
})

const Follow = mongoose.model("follow", FollowSchema)

module.exports = Follow