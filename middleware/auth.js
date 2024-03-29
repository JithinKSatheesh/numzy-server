const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Access denied. No token provided' });
  } else {
    try {
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
      req.user = decoded;
      next();
    } catch (ex) {
      return res.status(401).json({ success: false, error: 'Invalid Token' });
    }
  }
};
