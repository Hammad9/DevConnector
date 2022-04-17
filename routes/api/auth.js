const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')

// @route     GET api/auth
// @desc      Test route
// @access    Public     for token 


//second auth is like middleware
router.get('/', auth,async(req, res) => {
    try {
        res.send("Auth Routes")
        const user = await User.findById(req.user.id).select('-password')  //id say password select kara
        res.json(user);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

module.exports = router;