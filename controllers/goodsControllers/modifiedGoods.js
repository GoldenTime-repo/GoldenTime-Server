const { Goods, GoodsImage } = require('../../models');
const { s3 } = require('../../lib/multerMiddleware');

module.exports = async (req, res, next) => {
  try {
    const { goodsId, title, text } = req.body;
    const id = Number(goodsId);
    const imageFiles = req.files;
    const findImages = await GoodsImage.findAll({
      where: { goodId: id },
      attributes: ['imagePath'],
    });

    if ((req, files.length)) {
      const fileUrls = [];
      for (let i = 0; i < findImages.length; i++) {
        if (findImages[i].imagePath) {
          const fileUrl = findImages[i].imagePath.split('/');
          const delFileName = fileUrl[(fileUrl, length - 1)];
          fileUrls.push({ Key: delFileName });
        }
      }

      const params = {
        Bucket: 'golden-time-image',
        Delete: { Objects: fileUrls },
      };

      s3.deleteObject(params, (err) => {
        if (err) next(err);
      });

      const imageArray = imageFiles.reduce((acc, img) => {
        const obj = {};
        obj.goodId = id;
        obj.imagePath = img.location;
        acc.push(obj);
        return acc;
      }, []);
      await GoodsImage.destroy({ where: { goodId: id } });
      await GoodsImage.bulkCreate(imageArray);
      await Goods.update(
        { thumbnail: imageArray[0].imagePath },
        { where: { id: imageArray[0].goodId } },
      );
    }

    await Goods.update({ title, text }, { where: { id } });

    const updateGoods = await Goods.findOne({ where: { id } });
    res.status(200).json({ redirect_url: `/detail/${updateGoods.id}` });
  } catch (err) {
    next(err);
  }
};
