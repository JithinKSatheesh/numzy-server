const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
    return res.status(401).json({ success: false, error: 'Invalid Token' });
  } else {
    next();
  }
};
