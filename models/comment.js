module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'comment',
    {
      commentMessage: {
        type: DataTypes.STRING(),
        allowNUll: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    },
  );
