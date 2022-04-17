const express = require('express');
const router=express.Router();

// @route     GET api/Posts
// @desc      Test route
// @access    Publie     for token 

router.get('/',(req,res)=>res.send("Posts Routes"))

module.exports = router;