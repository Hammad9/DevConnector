const mongoose=require('mongoose');

const config = require('config')

const db= config.get('mongoURI')

const connectDB=async()=>{
   try{
      await mongoose.connect(db,{
          useNewUrlParser:true,   //for depreceated warning
      })
       console.log("Db Has Been Conected....")
   }
   catch(err){
       console.log(err.message)
        console.log("Hamad")
    //    Exit Process with Failure
    process.exit(1);
   }
}

module.exports = connectDB;