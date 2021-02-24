const { Goods, GoodsImage } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { title, text, price, categoryId, closing_time } = req.body;

    const goods = await Goods.create({
      userId: id,
      title,
      text,
      price,
      categoryId,
      thumbnail: req.files[0].location,
      closing_time,
    });

    const imageUpload = req.files.reduce((acc, file) => {
      const fileObject = {};
      fileObject.goodId = goods.id;
      fileObject.imagePath = file.location;
      acc.push(fileObject);
      return acc;
    }, []);

    await GoodsImage.bulkCreate(imageUpload);

    res.status(201).json({ redirect_url: `/goods/detail/${goods.id}` });
  } catch (err) {
    next(err);
  }
};
