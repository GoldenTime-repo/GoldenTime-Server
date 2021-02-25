const express = require('express');
const searchControllers = require('../controllers');

const router = express.Router();

router.post('/', searchControllers.search);

module.exports = router;
