const express = require('express');
const passport = require('passport');
const commentControllers = require('../controllers');

const router = express.Router();

router.post(
  '/addcomment',
  passport.authenticate('jwt', { session: false }),
  commentControllers.comments.addComment,
);
router.patch(
  '/modifiedcomment',
  passport.authenticate('jwt', { session: false }),
  commentControllers.comments.modifiedComment,
);
router.delete(
  '/deletecomment',
  passport.authenticate('jwt', { session: false }),
  commentControllers.comments.deleteComment,
);

module.exports = router;
