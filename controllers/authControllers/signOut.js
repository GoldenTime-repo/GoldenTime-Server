module.exports = (req, res, next) => {
  try {
    req.session.destroy(() => {
      req.session;
    });
    res.clearCookie();
    res.send({ message: 'successfully LOGOUT!' });
  } catch (err) {
    next(err);
  }
};
