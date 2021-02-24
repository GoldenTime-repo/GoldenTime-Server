const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { authorizationCode, area } = req.body;
    const googleToken = await axios.post(
      `https://oauth2.googleapis.com/token?client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_SECRET_KEY}&code=${authorizationCode}&grant_type=authorization_code&redirect_uri=http://localhost:3000`,
    );
    const { access_token } = googleToken.data;
    const googleData = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`,
    );
    const { email, name, id, picture } = googleData.data;
    const exUser = await User.findOrCreate({
      where: { email },
      default: {
        nick: name,
        snsId: id,
        profileImage: picture,
        area,
        provider: 'google',
      },
    });
    const [user, created] = exUser;

    const token = jwt.sign(
      {
        id: user.id,
        nick: user.nick,
        email: user.email,
        provider: user.provider,
        area: user.area,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );
    res
      .status(created ? 201 : 200)
      .cookie('access_token', token)
      .json({ access_token: token });
  } catch (err) {
    next(err);
  }
};
