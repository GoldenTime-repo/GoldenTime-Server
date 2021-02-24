const jwt = require('jsonwebtoken');
const { s3 } = require('../../lib/multerMiddleware');
const { User } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { nick } = req.body;
    const { id } = req.user;
    const findImage = await User.findOne({
      where: { id: req.user.id },
      attributes: ['profileImage'],
    });

    if (req.file && findImage.profileImage) {
      const fileUrl = findImage.profileImage.split('/');
      const delFileName = fileUrl[fileUrl.length - 1];
      const params = {
        Bucket: 'golden-time-image',
        Key: delFileName,
      };
      s3.deleteObject(params, (err) => {
        if (err) return next(err);
      });
    }

    await User.update(
      {
        nick,
        profileImage: req.file ? req.file.location : findImage.profileImage,
      },
      {
        where: { id: id },
      },
    );
    const updateInfo = await User.findOne({ where: { id: id } });
    const token = jwt.sign(
      {
        id: updateInfo.id,
        nick: updateInfo.nick,
        email: updateInfo.email,
        provider: updateInfo.provider,
        area: updateInfo.area,
        profileImage: updateInfo.profileImage,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );
    res.status(200).cookie('access_token', token).json({ access_token: token });
  } catch (error) {
    next(error);
  }
};
