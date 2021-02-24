const express = require('express');
const authController = require('../controllers');
const passport = require('passport');

const router = express.Router();
router.post('/signup', authController.auth.signUp);
router.post('/signin', authController.auth.signIn);
router.get(
  '/userinfo',
  passport.authenticate('jwt', { session: false }),
  authController.auth.userInfo,
);
router.post(
  '/signout',
  passport.authenticate('jwt', { session: false }),
  authController.auth.signOut,
);

module.exports = router;
