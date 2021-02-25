const { Comment } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { commentId } = req.body;
    const { id } = req.user;

    const commentInfo = await Comment.findOne({ where: { id: commentId } });

    if (id === commentInfo.userId) {
      await Comment.destroy({ where: { id: commentId } });
      res.status(200).json({ message: 'Deleted Successfully' });
    } else {
      res.status(401).json({ message: 'Not Authorized ' });
    }
  } catch (error) {
    next(error);
  }
};
