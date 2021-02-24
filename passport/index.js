const local = require('./localStrategy');
const jwt = require('./jwtStrategy');
const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } }, (err, user) => {
      if (err) return done(err);
      done(null, user);
    });
  });
  local(passport);
  jwt(passport);
};
