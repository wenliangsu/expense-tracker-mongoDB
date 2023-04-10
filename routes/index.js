const express = require('express');
const router = express.Router();
const auth = require('./modules/auth');

const users = require('./modules/users');
const records = require('./modules/records');

const { authenticated } = require('../middleware/auth');
const { generalErrorHandler } = require('../middleware/error-handler');

router.use('/users', users);

router.use('/auth', auth);
router.use('/records', authenticated, records);

// note 因已經設定驗證過使用者後導向records，所以req.query則要導向驗證過後的req.query，如果經過的話，則req.query會被擋在index這裡。
router.use('/', authenticated, records);

router.use('/', generalErrorHandler);

module.exports = router;
