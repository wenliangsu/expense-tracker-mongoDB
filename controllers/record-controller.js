const Record = require('../models/record');
const Category = require('../models/category');
const dayjs = require('dayjs');

const recordController = {
  //  Read all the records
  getRecords: (req, res, next) => {
    // note req.query.XXX  XXX要跟hbs裡的name屬性一樣的名字才可以傳入
    const reqQuery = req.query.categorySelector;
    const categorySelected = [];
    let totalAmount = 0;
    Category.find()
      .lean()
      .then(categories => {
        categories.forEach(category => {
          if (category._id.toString() === reqQuery) {
            // note 對物件產生一個新屬性selected
            category.selected = 'selected';
            categorySelected.push(reqQuery);
          } else if (!reqQuery) {
            categorySelected.push(category);
          }
        });
        Record.find({ categoryId: categorySelected })
          // note 兩個table關聯起來的用法, 如同sequelize 的include，可以變成dataA.dataB.xxx
          .populate('categoryId')
          .lean()
          .sort({ date: 'desc' })
          .then(records => {
            records.forEach(record => {
              record.date = dayjs(record.date).format('YYYY-MM-DD');
              totalAmount += record.amount;
            });
            res.render('records', {
              records,
              categories,
              totalAmount
            });
          });
      })
      .catch(err => next(err));
  }
};

module.exports = recordController;
