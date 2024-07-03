const jwt = require('jsonwebtoken')
const cookPars= require("cookie-parser")

const cors = require("cors")
const crypt = require("bcrypt")

const cloudinary = require('./utils/cloudinary')

if (process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express = require("express")
require("dotenv").config()


const app = express()

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://vibes-cli.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );

app.use(express.json({
    limit:'10mb'
}))
app.use(cors({
    origin:["https://vibes-cli.vercel.app"],
    methods:["POST","GET"],
    credentials:true
}))
app.use(cookPars())

const connectToDb = require("./config/connectToDb")
const Post = require("./models/Post")
const User = require("./models/User")
const Follow = require("./models/Follow")
const Comment = require("./models/Comment")

connectToDb()


const verifyUser=(req,res,next)=>{
    const token = req.cookies.token
    if(!token){
        return res.json({Error:"Your are not Auth"})
    }else{
        jwt.verify(token,"jwt-secret-ket",(err,decoded)=>{
            if(err){
                return res.json({Error:"Error"})
            }else{
                req.id = decoded.id
                next()
            }
        })
    }
}


app.get("/",verifyUser,async(req,res)=>{
    const usersV = await User.findOne({_id:req.id})
    return res.json({Status:"Success",dataUser:usersV})
})





app.post("/register",async(req,res)=>{
    const {name,pseudo,email,pass} = req.body

    const usersV = await User.findOne({Email:email})
    if(usersV){
        res.json("Email early used")
    }else{
        const hashPass = await crypt.hash(pass,15)
        const user = await User.create({
        Name: name,
        Pseudo: pseudo,
        Email:email,
        Password:hashPass,
        Bio:"",
        PicUrl:'http://res.cloudinary.com/dqvluqunu/image/upload/v1719752658/Picture/ixy4pcjcz4paj8fnohmx'
    })
    res.json(user)
    }
})

app.post("/login",async(req,res)=>{
    const {email,pass} = req.body;
    const usersV = await User.findOne({Email:email})
    if(usersV){
        const PassCompar =await crypt.compare(pass,usersV.Password)
        if(PassCompar){
            const name=  usersV.Name
            const id = usersV._id
            const token =  jwt.sign({id},"jwt-secret-ket",{expiresIn:'30d'})
            res.cookie('token',token)
            return res.json({Status:"Success"})
        }else{
            res.json("Wrong Pass")
        }
    }else{
        res.json("No Account")
    }
})

app.post('/pseudocheck',async(req,res)=>{
    const pseudo = req.body.pseudo
    const usersV = await User.findOne({Pseudo:pseudo})
    if(usersV){
        res.json(true)
    }else{
        res.json(false)
    }
})




app.post("/create",async(req,res)=>{
    const t = req.body.title
    const d = req.body.desc
    const tag = req.body.tag
    const userID = req.body.idUser
    const images = req.body.image
    const dateAll = new Date()
    const imageInfoListe = []
    
    
    try{
        if(images){
            for (const image in images){
                resImage = await cloudinary.uploader.upload(images[image],{
                    upload_preset:"Posts_preset",
                    transformation:[
                        {width:1000,crop:"scale",effect:'art:zorro'},
                    ]
                })
                imageInfoListe.push(resImage)
            }
            
        }
        const post = Post.create({
            UserID:userID,
            Titre: t,
            Desc:d,
            Tags:tag,
            Images:imageInfoListe,
            Date: dateAll.getDate
        })
        const user = await User.findByIdAndUpdate({_id:userID},{$push:{PostAccount:post}})
        res.json(user)
        
    }catch(error){
        res.json(error)
    }
    
    
})


app.get("/account/:pseudo",async(req,res)=>{
    const AccountID = req.params.pseudo
    const accountInfo = await User.findOne({Pseudo:AccountID})

    const followerCount = await Follow.countDocuments({Follower:AccountID})
    const followingCount = await Follow.countDocuments({Following:AccountID})

    res.json({accountInfo:accountInfo,follower:followerCount,following:followingCount})
})

app.get("/account/preferences/:pseudo",async(req,res)=>{
    const AccountID = req.params.pseudo
    const accountInfo = await User.findOne({Pseudo:AccountID})

    res.json(accountInfo)
})

app.get("/post/:id", async(req,res)=>{
    const postId = req.params.id
    try{
        const post = await Post.findById(postId)
        const liked = await Post.countDocuments({_id:postId})
        res.json({Status:'Success',postData:post,likeData:liked})
    }catch(error){
        res.json({Status:'Error'})
    }
    
    
})

app.get("/results/:query", async(req,res)=>{
    // res.json(req.query+req.params.query);
    // const userIDD = req.body.id

    const post = await Post.find({Titre:{$regex:'.*'+req.params.query+'.*'}})

    res.json(post)
})

app.post("/account/update",async(req,res)=>{
    const UserID = req.body.id
    const bio = req.body.bio
    const name = req.body.name
    const Picture = req.body.pic
    
    const prevAccount = await User.findOne({Pseudo:UserID})

    const PrevPic = prevAccount.PicUrl

    if (Picture){
        cloudinary.uploader.destroy(prevAccount.PubID)
        resImage = await cloudinary.uploader.upload(Picture,{
            upload_preset:"Picture_preset",
            transformation:[
                {width:300,crop:"scale"},
            ]
        })
        const account = await User.findOneAndUpdate({Pseudo:UserID},{
            Bio:bio,
            Name:name,
            PicUrl:resImage.url,
            PubID:resImage.public_id
        })
        res.json(account)
    }else{
        const account = await User.findOneAndUpdate({Pseudo:UserID},{
            Bio:bio,
            Name:name
        })
        res.json(account)
    }
    
    
})

app.post("/post/randomPost",async(req,res)=>{
    const post = await Post.aggregate().sample(3)

    res.json(post)
})

app.post("/post/account",async(req,res)=>{
    const id = req.body.id

    const post = await Post.find({UserID:id})

    res.json(post)
})

app.post("/post/:id/addLike", async(req,res)=>{
    const postId = req.params.id
    const UserId = req.body.idUser

    await Post.findByIdAndUpdate(postId,{
        $push:{Like:UserId}
    })
    const post = await Post.findById(postId)

    res.json({Like:post.Like.length})
})

app.post("/post/:id/rLike", async(req,res)=>{
    const postId = req.params.id
    const UserId = req.body.idUser

    await Post.findByIdAndUpdate(postId,{
        $pull:{Like:UserId}
    })
    const post = await Post.findById(postId)

    res.json({Like:post.Like.length})
})

app.listen(process.env.PORT)

app.post("/follow",async(req,res)=>{
    const userID = req.body.userID
    const accountFollow = req.body.accountFollow

    const followx = await Follow.findOne({Follower:accountFollow,Following:userID})

    if(!followx){
        const follow = await Follow.create({
            Follower: accountFollow,
            Following: userID
        })
        res.json("follow")
    }else{
        await Follow.deleteOne({Follower:accountFollow,Following:userID})
        res.json('unfollow')
    }

})

app.post("/followVerif",async(req,res)=>{
    const userID = req.body.userID
    const accountFollow = req.body.accountFollow

    const followx = await Follow.findOne({Follower:accountFollow,Following:userID})
    
   res.json(followx)
})
app.post("/followCount",async(req,res)=>{
    const userID = req.body.userID

    const followerCount = await Follow.countDocuments({Follower:userID})
    const followingCount = await Follow.countDocuments({Following:userID})

    res.json({follower:followerCount,following:followingCount})
})

app.post("/post/search",async(req,res)=>{
    const id = req.body.id
    const posts = await Post.find({UserID:id}).limit(5)

    res.json(posts)
})

app.post("/comment",async(req,res)=>{
    const userID = req.body.id
    const postID = req.body.postID
    const message = req.body.message

    const comment = await Comment.create({
        UserID:userID,
        PostID:postID,
        Content:message,
        Date: new Date
    })

    res.json(comment)
})

app.post("/comment/search",async(req,res)=>{
    const postID = req.body.postID

    const comment = await Comment.find({PostID:postID}).limit(10)

    res.json(comment)
})
app.post("/post/delete",async(req,res)=>{
    const postID = req.body.postID
    del =  await Post.findById(postID)
    
    for (const image in del.Images){
        resImage = await cloudinary.uploader.destroy(del.Images[image].public_id)
    }
    await Post.findByIdAndDelete(postID)
    await Comment.deleteMany({PostID:postID})
    res.json(del)

})
