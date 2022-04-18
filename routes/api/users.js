const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config');

const User = require('../../models/User')

// @route     POST api/users
// @desc      Register User
// @access    Publie     for token 

router.post('/', [
    check('name', 'Name is Required')
        .not()
        .isEmpty(),
    check('email', 'Email is Required').isEmail(),
    check('password', 'Please Enter a Password with 6 or More Characters').isLength({ min: 6 }),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)

    const { name, email, password } = req.body;    //withou this write req.body.name,req.body.email .. 

    try {

        // See if User Exits
        let user = await User.findOne({ email })    //email match karay ga agar user alredy ho ga

        if (user) {
            res.status(400).json({ errors: [{ msg: 'User Already Exist' }] })
        }

        // Get user Gravator
        const avatar = gravatar.url(email, {
            s: '200',   //size
            r: 'pg',   // radian
            d: 'mm'   // default   image if user not have gravatar
        })

        user = new User({   //use to save user in db using user.save but first hash password
            name,
            email,
            avatar,
            password,

        })
        // Encrypt Password

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return Json webtoken

        const payload = {
            user: {
                id: user.id,       //its mean mongodb id which assign is user._id
            },
        };

        jwt.sign(
            payload,                 //payload
            config.get('jwtSecret'),  //sectroet
            { expiresIn: 360000 },      //optional
            (err, token) => {           //call back which send error if error token if not error
                if (err) throw err;
                res.send({ token });

            }
        )

        // res.send("User Register")
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})

module.exports = router;