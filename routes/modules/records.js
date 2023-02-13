const express = require('express');
const router = express.Router();

const recordController = require('../../controllers/record-controller');

router.get('/create', recordController.createRecord);
router.post('/', recordController.postRecord);

router.get('/', recordController.getRecords);

module.exports = router;
