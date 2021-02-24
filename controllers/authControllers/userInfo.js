module.exports = (req, res) => {
  const { id, email, nick, profileImage, provider, area, createdAt } = req.user;

  res.status(200).json({
    id,
    email,
    nick,
    profileImage,
    provider,
    area,
    createdAt,
  });
};
