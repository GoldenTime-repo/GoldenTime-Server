module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'goodsImage',
    {
      imagePath: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: false,
    },
  );
