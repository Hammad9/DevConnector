const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')

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
});


// Below Code is users.js file validation etc
// @route     POST api/auth
// @desc      Authenticate User and Get token
// @access    Publie     for token 

router.post('/', [
    check('email', 'Email is Required').isEmail(),
    check('password', 'Please Enter a Password with 6 or More Characters').exists,

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)

    const { email, password } = req.body;    //withou this write req.body.name,req.body.email .. 

    try {

        // See if User Exits
        let user = await User.findOne({ email })    //email match karay ga agar user alredy ho ga

        if (!user) {
            res.status(400).json({ errors: [{ msg: 'Invalid Crediential' }] })
        }

    //   Here Start and Matching the email and password

    const isMatch=await bcrypt.compare(password,user.password)  //match user password and ecrypted password


    if(!isMatch){
        res.status(400).json({ errors: [{ msg: 'Invalid Crediential' }] })
    }
        // Return Json webtoken

        const payload = {
            user: {
                id: user.id,       //its mean mongodb id which assign is user._id
            }
        };

        jwt.sign(
            payload,                 //payload
            config.get('jwtSecret'),  //sectroet
            { expiresIn: 360000 },      //optional
            (err, token) => {           //call back which send error if error token if not error
                if (err) throw err;
                res.json({ token });

            }
        )

        res.send("User Register")
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})

module.exports = router;