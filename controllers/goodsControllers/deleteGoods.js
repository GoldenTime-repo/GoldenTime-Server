const { Goods, GoodsImage } = require('../../models');
const { s3 } = require('../../lib/multerMiddleware');

module.exports = async (req, res, next) => {
  try {
    const { goodsId } = req.body;

    const images = await GoodsImage.findAll({
      where: { goodId: goodsId },
      attributes: ['imagePath'],
    });

    if (images.length) {
      const fileUrls = [];
      for (let i = 0; i < images.length; i++) {
        const fileUrl = images[i].imagePath.split('/');
        const delFileName = fileUrl[fileUrl.length - 1];
        fileUrls.push({ Key: delFileName });
      }
      const params = {
        Bucket: 'golden-time-image',
        Delete: { Objects: fileUrls },
      };
      s3.deleteObject(params, (err) => {
        if (err) return next(err);
      });
      await GoodsImage.destroy({
        where: { goodId: goodsId },
      });
    }

    await Goods.destroy({ where: { id: goodsId } });

    res.status(200).json({ redirect_url: '/' });
  } catch (error) {
    next(error);
  }
};
