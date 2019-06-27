const express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const { check, validationResult } = require('express-validator/check');

//@route    GET api/profile/MyProfile
//@desc     Get current Auth Profile
//@access   Private
router.get('/MyProfile', auth, async (req, res) => {
  try {
    //Get user id and get name and avatar pic from  user model
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    //No Profile Found
    if (!profile) {
      res.status(400).json({ msg: 'No Profile found for this user' });
    }
    //Success - Profile found - send profile variable
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error - Cannot find profile');
  }
});

//@route    POST api/profile
//@desc     Create or Update a user profile
//@access   Private
router.post(
  '/',
  [
    auth,
    [
      check('userType', 'userType is required')
        .not()
        .isEmpty(),
      check('bio', 'bio is required')
        .not()
        .isEmpty(),
      check('location', 'location is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Check
    const { userType, bio, location } = req.body;

    //Create Profile Object
    const profileDetails = {};
    // Get the user ID to retrieve the correct ProfileDetails
    profileDetails.user = req.user.id;

    //Get Profile Details
    if (userType) profileDetails.userType = userType;
    if (bio) profileDetails.bio = bio;
    if (location) profileDetails.location = location;

    /* -----Example for Future work-----
  
    Example -  if I had field which was an array of words , I need to split with an comman 
    and trim .  This will also validate if users do not include a comma or if they just use a space.

     if(exampleArray) { 
      profileDetails.exampleArray = exampleArray.split(',').map(exampleArray => exampleArray.trim()); 
    }
      console.log(profileDetails.exampleArray);
      res.send('test');
      
      
    */

    try {
      //Get Profile by User id
      let profile = await Profile.findOne({ user: req.user.id });

      //If profile is found
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileDetails },
          { new: true }
        );

        //Return
        return res.json(profile);
      }

      //Create Profile if not found
      profile = new Profile(profileDetails);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    Get api/profile
//@desc     Get all profiles
//@access   Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    Get api/profile/user/user_id
//@desc     Get profile by userID
//@access   Public

router.get('/user/:user_id', async (req, res) => {
  try {
    //Find Profile using user_id
    const profile = await Profile.findById({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    //Check Profile
    if (!profile) {
      res.status(400).json({ msg: 'No Profile found for this user' });
    }
    //Send Profile
    res.json(profile);
  } catch (err) {
    //Invalid user_id check - if the user_id is invalid number of characters
    if (err.kind == 'ObjectId') {
      res.status(400).json({ msg: 'No Profile found for this user' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    Delete api/profile
//@desc     Delete user , profile and posts
//@access   Private

router.delete('/', auth, async (req, res) => {
  try {
    //-todo - Remove Users Posts

    //Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error - Cannot find profile');
  }
});

module.exports = router;
