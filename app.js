// Confirm environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Section Invoke the package
const express = require('express');
const exphbs = require('express-handlebars').engine;
const methodOverride = require('method-override');

const routes = require('./routes');
const app = express();
const port = process.env.PORT || 3000;
require('./config/mongoose');

// Section package use
// template and engine
app.engine('hbs', exphbs({ extname: 'hbs' }));
app.set('view engine', 'hbs');

// body-parser
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));
app.use(routes);

app.listen(port, () => {
  console.info(`Expense-tracker is listening on localhost: ${port}`);
});
