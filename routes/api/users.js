const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { check, validationResult } = require('express-validator/check');

//Call User Model
const User = require('../../models/User');

//@route    GET api/users
//@desc     Test route
//@access   Public - no token needed
router.get('/', (req, res) => res.send('User route'));

//@route    Post api/users
//@desc     Register user
//@access   Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Email is required')
      .not()
      .isEmpty(),
    check(
      'password',
      'Please enter a password. Your password must be 6 or more characters'
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    //using async will allow us to use await instead .then
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      //Checks if user exists already
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      //Gets users image - User Image from Gravatar
      const avatar = gravatar.url(email, {
        s: '200', // Default size
        r: 'pg', // Rating of Image
        d: 'mm' // Default image
      });

      // Creates an instance
      user = new User({
        name,
        email,
        avatar,
        password
      });

      //Encrypts users password (Bcrypt)
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Returns json Web Token
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecretToken'),
        { expiresIn: 360000 }, //change expires in back to 3600 during production!!
        (err, token) => {
          if (err) throw err; // if error
          res.json({ token }); //if successful, it will return token
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
