const express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth'); //used for Protected Routes
const User = require('../../models/User'); // User Model
//@route    GET api/auth
//@desc     Test route
//@access   Public - no token needed
router.get('/', auth, async (req, res) => {
  try {
    //Get user model , requests userdata by user(ID) but we exclude the password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
