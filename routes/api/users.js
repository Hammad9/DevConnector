const express = require('express');
const { check, validationResult } = require('express-validator');
const router=express.Router();

// @route     POST api/users
// @desc      Register User
// @access    Publie     for token 

router.post('/',[
    check('name','Name is Required')
    .not()
    .isEmpty(),
    check('email','Email is Required').isEmail(),
    check('password','Please Enter a Password with 6 or More Characters').isLength({min:6}),

],(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    
    console.log(req.body)
    res.send("User Routes")

})

module.exports = router;