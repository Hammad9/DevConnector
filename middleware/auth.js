const jwt=require('jsonwebtoken');

const config = require('config');

module.exports=(req,res,next)=>{
   
    // Get Token from header
    const token = req.header('x-auth-token');

    // Check if Not token 
    if(!token){
        return res.status(401).json({message:'No Token Authorization Required'})
    }

    // Verify Token 
    try{
        // Here we decode the token and assign to req.user
        const decode=jwt.verify(token,config.get('jwtSecret'))   //second is jwtSecret which in config

        req.user=decode.user;
        next();   //send to next page if token match beacuse its work like middleware if login show another pages

    }
    catch(err){
        return res.status(401).json({msg:'Token is Not valid'})
    }
  }