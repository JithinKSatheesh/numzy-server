const jwt = require('jsonwebtoken');
const config = require('config');

module.exports.generateToken = (id) => {
  const token = jwt.sign({ id: id }, config.get('jwtPrivateKey'));
  return token;
};

module.exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtPrivateKey);
  } catch (ex) {
    return new Error('Invalid Token');
  }
};
