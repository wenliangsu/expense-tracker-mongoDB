const Record = require('../models/record');
const Category = require('../models/category');

const dayjs = require('dayjs');

const recordController = {
  //  Read all the records
  getRecords: (req, res, next) => {
    // note req.query.XXX  XXX要跟hbs裡的name屬性一樣的名字才可以傳入
    const reqQuery = req.query.categorySelector;
    const userId = req.user._id;
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
        Record.find({ userId, categoryId: categorySelected })
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
  },
  getCreateRecordPage: (req, res, next) => {
    Category.find()
      .lean()
      .then(categories => {
        res.render('create-record', { categories });
      });
  },
  createRecord: (req, res, next) => {
    const userId = req.user._id;
    const { name, date, categoryId, amount } = req.body;

    // verify the data
    if (!name || !date || !categoryId || !amount) {
      throw new Error('All field are required !!');
    }

    return Record.create({ name, date, categoryId, amount, userId })
      .then(() => {
        req.flash('success_message', 'The record is created successfully');
        res.redirect('/records');
      })
      .catch(err => next(err));
  },
  getEditRecordPage: (req, res, next) => {
    const userId = req.user._id;
    const urlId = req.params.id;

    Promise.all([Record.findById(urlId).lean(), Category.find().lean()])
      .then(([record, categories]) => {
        if (record.userId.toString() !== userId.toString()) {
          throw new Error("You can't edit other peoples's record !!");
        }

        record.date = dayjs(record.date).format('YYYY-MM-DD');

        return res.render('edit-record', { record, categories });
      })
      .catch(err => next(err));
  },
  editRecord: (req, res, next) => {
    const userId = req.user._id;
    const urlId = req.params.id;

    const { name, date, categoryId, amount } = req.body;

    if (!name || !date || !categoryId || !amount) {
      throw new Error('All field are required !!');
    }

    //  note 操作語法可以看官方文件，先找id比對後，在更新物件(findByIdAndUpdate(id, update, option))
    Record.findByIdAndUpdate(
      {
        _id: urlId,
        userId
      },
      {
        name,
        date,
        categoryId,
        amount
      }
    )
      .then(() => {
        res.redirect('/');
      })
      .catch(err => next(err));
  }
};

module.exports = recordController;
