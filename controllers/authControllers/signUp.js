const { User } = require('../../models');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
  try {
    const { email, nick, password, area } = req.body;
    if (!email || !nick || !password) return res.status(400).send('error');
    const hash = await bcrypt.hash(password, 12);
    const exUser = await User.findOrCreate({
      where: { email },
      defaults: { nick, password: hash, area },
    });
    const [user, created] = exUser;
    if (created) {
      res.status(201).json({ redirect_url: '/' });
    } else {
      res.status(400).json({ message: '이미 가입된 회원입니다.' });
    }
  } catch (error) {
    next(error);
  }
};
