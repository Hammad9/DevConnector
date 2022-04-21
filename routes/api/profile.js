const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator');
// @route     GET api/profile
// @desc      Get Current User Profile
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


// @route     POST api/profile
// @desc      Create or Update the User Profile
// @access    Publie     for token 

router.post('/', [
    auth, [
        check('status', 'Status is Required')
            .not()
            .isEmpty(),
        check('skills', 'Skills is Required')
            .not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req)   //Error Checking
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {company,website,location,bio,status,githubusername,skills,youtube,facebook,twitter,instagram,linkedin }=req.body;
    console.log(req.body);

    // Build Profile Object
    const profileFields={};
    profileFields.user=req.user.id;
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername=githubusername;
    if(skills){
        profileFields.skills=skills.split(',').map(skill=>skill.trim());

    }
    // console.log(profileFields.skills)

    // Build Social Objects
    profileFields.social={}
    if(youtube) profileFields.youtube=youtube;
    if(twitter) profileFields.twitter=twitter;
    if(facebook) profileFields.facebook=facebook;
    if(linkedin) profileFields.linkedin=linkedin;
    if(instagram) profileFields.instagram=instagram;


    try{
        let profile=await Profile.findOne({user:req.user.id});

        if(profile){
            // Update
            profile=await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true},
            );

            return res.json(profile);
        }

        // Create
        profile=new Profile(profileFields);

        await profile.save();
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    res.send("Hello")
})  

module.exports = router;