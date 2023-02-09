const express = require('express');
const router = express.Router();
const users = require('./modules/users');
const recordController = require('../controllers/record-controller');

router.use('/users', users);

// todo 做到render records要移動
router.get('/records', recordController.getRecords);

router.get('/', (req, res) => res.redirect('/records'));

module.exports = router;
