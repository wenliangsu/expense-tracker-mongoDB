const db = require('../../config/mongoose');

const Category = require('../category');
const SEED_CATEGORY = require('../seeds/categorySeedData.json').results;

db.once('open', () => {
  Category.insertMany(SEED_CATEGORY)
    .then(() => {
      console.log('Categories seed is created !!');
      process.exit();
    })
    .catch(err => console.error(err));
});
