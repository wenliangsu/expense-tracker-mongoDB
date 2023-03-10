// Confirm environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Section Invoke the package
const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');

const handlebarsHelpers = require('./helpers/handlebars-helpers');
const { getUser } = require('./helpers/auth-helpers');

const routes = require('./routes');
const app = express();
const port = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;
require('./config/mongoose');

// Section package use
// template and engine
app.engine(
  'hbs',
  exphbs.create({ extname: '.hbs', helpers: handlebarsHelpers }).engine
);
app.set('view engine', 'hbs');

// body-parser
app.use(express.urlencoded({ extended: true }));

// static file
app.use(express.static('public'));

// set router.put and delete
app.use(methodOverride('_method'));

// set session for browser
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);

// set passport
app.use(passport.initialize());
app.use(passport.session());

// set flash message
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_message');
  res.locals.warning_msg = req.flash('warning_message');
  res.locals.error_msg = req.flash('error_message');
  res.locals.user = getUser(req);
  next();
});

app.use(routes);

app.listen(port, () => {
  console.info(`Expense-tracker is listening on localhost: ${port}`);
});
