const mongoose =require("mongoose")

if (process.env.NODE_ENV !="production"){
    require("dotenv").config();
}


async function connectToDb(){
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log(process.env.DB_URL)
    }catch(error){
        console.log(error)
    }
}
module.exports = connectToDb