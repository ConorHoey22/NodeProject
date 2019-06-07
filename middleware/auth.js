const jwt = require('jsonwebtoken');

const config = require('config');

//Middleware function
module.exports = function(req, res, next) {
  //Get token from header

  const token = req.header('x-auth-token');

  //Check for no token
  if (!token) {
    return res.status(401).json({ msg: 'No Token, Authorization denied' });
  }

  //Verify the token
  try {
    //decode token
    const decoded = jwt.verify(token, config.get('jwtSecretToken'));
    //get user
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.statas(401).json({ msg: 'Invalid Token' });
  }
};
