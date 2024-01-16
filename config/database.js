const mongoose=require('mongoose')
require('dotenv').config()

//database connection 

const connect=async()=>{
    try{
      await mongoose.connect(process.env.MONGO_URI)
      console.log('connected to database')
    }

    catch(err){
        console.log(err)
    }
}

module.exports=connect 