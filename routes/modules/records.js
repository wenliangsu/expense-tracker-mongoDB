const express = require('express');
const router = express.Router();

const recordController = require('../../controllers/record-controller');

router.get('/create', recordController.getCreateRecordPage);
router.post('/', recordController.createRecord);

router.get('/:id/edit', recordController.getEditRecordPage);
router.put('/:id', recordController.editRecord);

router.delete('/:id', recordController.deleteRecord);

router.get('/', recordController.getRecords);

module.exports = router;
