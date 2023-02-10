const express = require('express');
const router = express.Router();

const users = require('./modules/users');

const recordController = require('../controllers/record-controller');

const { authenticated } = require('../middleware/auth');
const { generalErrorHandler } = require('../middleware/error-handler');

router.use('/users', users);

// todo 做到render records要移動
router.get('/records', authenticated, recordController.getRecords);

router.get('/', (req, res) => res.redirect('/records'));

router.use('/', generalErrorHandler);

module.exports = router;
