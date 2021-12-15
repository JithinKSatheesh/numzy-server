module.exports = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (exp) {
      console.log(exp);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  };
};
