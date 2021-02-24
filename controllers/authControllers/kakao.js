const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { authorizationCode, area } = req.body;

    const kakaoTokenRequest = await axios.post(
      `https://kauth.kakao.com/oauth/token?code=${authorizationCode}&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=http://localhost:3000&grant_type=authorization_code`,
    );
    const kakaoAccessToken = kakaoTokenRequest.data.access_token;
    const kakaoData = await axios.get('https://kapi.kakao.com/v2/user/me', {
      header: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });

    const {
      id,
      email,
      properties: { nickname, thumbnail_image },
    } = kakaoData.data;

    const exUser = await User.findOrCreate({
      where: { email },
      defaults: {
        snsId: id,
        nick: nickname,
        profileImage: thumbnail_image,
        area,
        provider: 'kakao',
      },
    });
    const [user, created] = exUser;

    const token = jwt.sign(
      {
        id: user.id,
        emai: user.email,
        nick: user.nick,
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
      .json({ access_token: token, redirect_url: '/' });
  } catch (err) {
    next(err);
  }
};
