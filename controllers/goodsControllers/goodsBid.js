const { Goods } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { bidPrice, goodsId } = req.body;

    await Goods.update(
      {
        bidPrice,
        bidder: req.user.id,
      },
      { where: { id: goodsId } },
    );

    res.status(200).json({
      bidder: { id: req.user.id, nick: req.user.nick },
      bidPrice,
    });
  } catch (error) {
    next(error);
  }
};
