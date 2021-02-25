const express = require('express');
const goodsController = require('../controllers');
const { upload } = require('../lib/multerMiddleware');
const passport = require('passport');

const router = express.Router();

router.post(
  '/addgoods',
  passport.authenticate('jwt', { session: false }),
  upload.array('img'),
  goodsController.goods.addGoods,
);
router.post('/', goodsController.goods.goodsList);
router.get('/detail/:id', goodsController.goods.goodsDetail);
router.patch(
  '/modified',
  passport.authenticate('jwt', { session: false }),
  upload.any('img'),
  goodsController.goods.modifiedGoods,
);
router.post(
  '/delete',
  passport.authenticate('jwt', { session: false }),
  goodsController.goods.deleteGoods,
);

module.exports = router;
