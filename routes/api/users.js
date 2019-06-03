const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

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
  (req, res) => {
    //  console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send('User register');
  }
);

module.exports = router;
