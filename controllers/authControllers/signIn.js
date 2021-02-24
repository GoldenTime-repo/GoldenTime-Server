const jwt = require('jsonwebtoken');
const passport = require('passport');

module.exports = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(400)
        .json({ message: info.message, redirect_url: '/login' });
    }
    return req.login(user, (err) => {
      if (err) return next(err);
      const token = jwt.sign(
        {
          id: user.id,
          nick: user.nick,
          email: user.email,
          provider: user.provider,
          area: user.area,
          profileImage: user.profileImage,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
      );
      res
        .status(200)
        .cookie('access_token', token)
        .json({ access_token: token, redirect_url: '/' });
    });
  })(req, res, next);
};
