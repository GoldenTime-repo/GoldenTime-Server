const bcrypt = require('bcrypt');
const { User } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { password, newPassword } = req.body;
    const userInfo = await User.findOne({ where: { id } });
    if (!userInfo) {
      res.status(400).json({ message: '로그인이 필요합니다.' });
    } else {
      const result = await bcrypt.compare(password, userInfo.password);
      if (result) {
        const hash = await bcrypt.hash(newPassword, 12);
        await User.update({ password: hash }, { where: { id } });
        res
          .status(200)
          .json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
      } else {
        res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
      }
    }
  } catch (err) {
    next(err);
  }
};
