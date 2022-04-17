const express = require('express');
const router=express.Router();

// @route     GET api/auth
// @desc      Test route
// @access    Public     for token 

router.get('/',(req,res)=>res.send("Auth Routes"))

module.exports = router;