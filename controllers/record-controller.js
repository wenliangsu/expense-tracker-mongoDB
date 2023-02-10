const Record = require('../models/record');
const Category = require('../models/category');
const dayjs = require('dayjs');

const recordController = {
  //  Read the record
  getRecords: (req, res, next) => {
    let totalAmount = 0;
    Category.find()
      .lean()
      .then(categories => {
        Record.find()
          // note 兩個table關聯起來的用法, 如同sequelize 的include，可以變成dataA.dataB.xxx
          .populate('categoryId')
          .lean()
          .then(records => {
            records.forEach(record => {
              record.date = dayjs(record.date).format('YYYY-MM-DD');
              totalAmount += record.amount;
            });
            console.log(records);
            res.render('records', { records, totalAmount });
          });
      })
      .catch(err => next(err));
  }
};

module.exports = recordController;
