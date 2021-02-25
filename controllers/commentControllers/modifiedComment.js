const { Comment, User } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { commentMessage, commentId, goodsId } = req.body;
    const eqUser = await Comment.findOne({ where: { id: commentId } });

    if ((eqUser.userId === req, user.id)) {
      await Comment.update(
        { commentMessage },
        { where: { goodId: goodsId, id: commentId } },
      );

      const commentInfo = await Comment.findOne({
        where: {
          goodId: goodsId,
          id: commentId,
        },
        attributes: ['id', 'commentMessage', 'updatedAt'],
        include: {
          model: User,
          attributes: ['id', 'nick', 'profileImage'],
        },
      });

      res.status(200).json(commentInfo);
    } else {
      res
        .status(400)
        .json({ message: '다른 유저의 댓글은 수정, 삭제하실 수 없습니다.' });
    }
  } catch (error) {
    next(error);
  }
};
