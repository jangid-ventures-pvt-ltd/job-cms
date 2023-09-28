// middleware/checkRole.js
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (role) => {
  return (req, res, next) => {
    const token = req.header('Authorization'); // Get the token from the request header

    if (!token) {
      return res.status(403).json({ error: 'Unauthorized: Token missing' });
    }

    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtSecret); // Extract the token correctly

      if (decoded && decoded._id) {
        // Log the decoded token for debugging
        console.log('Decoded Token:', decoded);
        console.log('Required Role:', role);
        console.log('User Role:', decoded.role);

        // Check the role from the token payload
        if (decoded.role === role) {
          // User has the required role, allow access
          next();
        } else {
          res.status(403).json({ error: 'Unauthorized: Role mismatch' });
        }
      } else {
        res.status(403).json({ error: 'Unauthorized: Invalid token content' });
      }
    } catch (err) {
      res.status(403).json({ error: 'Unauthorized: Token verification failed' });
    }
  };
};
