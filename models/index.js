'use strict';
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.js'))[env];
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Goods = require('./goods')(sequelize, Sequelize);
db.GoodsImage = require('./goodsImage')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

db.User.hasMany(db.Goods, { foreignKey: { allowNull: false } });
db.Goods.belongsTo(db.User);
db.Goods.hasMany(db.GoodsImage, {
  foreignKey: { allowNull: false },
});
db.GoodsImage.belongsTo(db.Goods);
db.Goods.hasMany(db.Comment, { foreignKey: { allowNull: false } });
db.Comment.belongsTo(db.Goods);
db.User.hasMany(db.Comment, { foreignKey: { allowNull: false } });
db.Comment.belongsTo(db.User);
db.User.hasOne(db.Goods, { foreignKey: { name: 'bidder' } });
db.Goods.belongsTo(db.User);

module.exports = db;