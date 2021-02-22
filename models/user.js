module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'user',
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      area: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    },
  );
