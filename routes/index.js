const express = require('express');
const router = express.Router();

const users = require('./modules/users');
const records = require('./modules/records');

const { authenticated } = require('../middleware/auth');
const { generalErrorHandler } = require('../middleware/error-handler');

router.use('/users', users);
router.use('/records', authenticated, records);

// todo 做到render records要移動

router.get('/', (req, res) => res.redirect('/records'));

router.use('/', generalErrorHandler);

module.exports = router;
