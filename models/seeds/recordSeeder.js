const db = require('../../config/mongoose');

const bcrypt = require('bcryptjs');

const Category = require('../category');
const Record = require('../record');
const User = require('../user');

const SEED_RECORDS = require('../seeds/recordSeedData.json').results;
const SEED_USERS = require('../seeds/userSeedData.json').results;

db.once('open', async () => {
  // note 利用await練習，可以思考換成promise要怎麼做
  try {
    // insert users date
    SEED_USERS.forEach(user => {
      user.password = bcrypt.hashSync(user.password, 10);
    });
    // note await 後面要用在promise物件
    await User.create(SEED_USERS);

    // compare the category into the seed record
    // Thinking 利用map後，要接住回傳值，然後給下一段使用, then裡面也要回傳值出去外層後再利用
    const categorizeRecordList = await Category.find()
      .lean()
      .then(categories => {
        return SEED_RECORDS.map(record => {
          const category = categories.find(c => c.name === record.category);
          if (!category) return record;

          // note 先展開record 形成一個物件後，再將id帶入
          return { ...record, categoryId: category._id };
        });
      });

    // Insert userId to record
    const FinialRecords = await User.find({})
      .lean()
      .then(users => {
        return categorizeRecordList.map((record, recordIndex) => {
          return { ...record, userId: users[recordIndex < 3 ? 0 : 1]._id };
        });
      });

    // create the record
    await Record.create(FinialRecords);
    console.log('Records seed is created !!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
});
