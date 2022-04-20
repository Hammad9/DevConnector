const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
// @route     GET api/profile
// @desc      Test route
// @access    Publie     for token 

router.get('/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate(  
            //user may say name and avatar ko get kiya then check what profile is or not
            'user',
            ['name', 'avatar']
        );

        if (!profile) {
            return res.status(400).json({ msg: 'There is No profile for this User' })
        }
        res.json(profile);
         
    }
    catch (err) {
        console.log(err.message)
       return res.status(500).send('Server Error')
    }
})

module.exports = router;