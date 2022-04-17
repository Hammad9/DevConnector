const express = require('express');
const router=express.Router();

// @route     GET api/profile
// @desc      Test route
// @access    Publie     for token 

router.get('/',(req,res)=>res.send("Profile Routes"))

module.exports = router;