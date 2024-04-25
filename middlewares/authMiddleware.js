// authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
var localStorage = require('localStorage')


const authenticateToken = (req, res, next) => {
  const token = req.query.token;
  if (token == null) return res.redirect('/'); 

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.redirect('/');
    // Store user information in the request object
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
