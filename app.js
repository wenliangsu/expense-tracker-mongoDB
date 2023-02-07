// Confirm environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Section Invoke the package
const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const port = process.env.PORT || 3000;

// Section package use
// template and engine
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');

// body-parser
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.info(`Expense-tracker is listening on localhost: ${port}`);
});
