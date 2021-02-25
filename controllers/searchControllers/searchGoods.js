const { User, Goods } = require('../../models');
const { Op } = require('sequelize');

module.exports = async (req, res, next) => {
  try {
    const { area, str } = req.body;

    const filterArea = await User.findAll();
    const result = filterArea
      .filter((user) => (area ? user.area === area : user.id))
      .map((data) => data.id);

    const findGoods = await Goods.findAll({
      attributes: [
        'id',
        'title',
        'text',
        'price',
        'bidPrice',
        'thumbnail',
        'categoryId',
        'closing_time',
      ],
      where: {
        title: { [Op.like]: `%${str}%` },
        [Op.and]: [{ userId: [...result] }],
      },
      include: [
        {
          model: User,
          attributes: ['id', 'nick', 'profileImage'],
        },
      ],
    });

    res.status(200).json(findGoods);
  } catch (error) {
    next(error);
  }
};
