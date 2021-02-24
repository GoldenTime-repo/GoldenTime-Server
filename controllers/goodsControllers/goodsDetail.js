const { User, Goods, GoodsImage, Comment } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findGoods = await Goods.findAll({
      include: [
        {
          model: GoodsImage,
          required: false,
          attributes: ['imagePath'],
          where: {
            goodId: id,
          },
        },
        {
          model: User,
          attributes: ['id', 'nick', 'profileImage'],
        },
        {
          model: Comment,
          required: false,
          attributes: ['id', 'userId', 'commentMessage', 'createAt'],
          where: { goodId: id },
        },
        {
          include: [
            {
              model: User,
              attributes: ['id', 'nick', 'profileImage', 'createdAt'],
            },
          ],
          order: ['createdAt', 'DESC'],
        },
      ],
      where: {
        id: id,
      },
      attributes: [
        'id',
        'title',
        'text',
        'price',
        'bidPrice',
        'categoryId',
        'closing_time',
        'bidder',
      ],
    });
    const { bidder } = findGoods[0];

    const bidderInfo = { bidder: {} };

    if (bidder) {
      const findBidder = await User.findOne({ where: { id: bidder } });
      const bidderObj = {};
      const { id, nick } = findBidder;
      bidderObj.id = id;
      bidderObj.nick = nick;
      bidderInfo.bidder = bidderObj;
    }
    const goods = Object.assign(findGoods[0], bidderInfo);
    res.status(200).json(goods);
  } catch (err) {
    next(err);
  }
};
