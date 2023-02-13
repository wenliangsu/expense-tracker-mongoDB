const dayjs = require('dayjs');
module.exports = {
  // note 利用dayjs套件取得當前年份
  currentYear: () => dayjs().year(),
  ifCond: function (category, record, options) {
    return category._id.toString() === record.categoryId.toString()
      ? options.fn(this)
      : options.inverse(this);
  }
};
