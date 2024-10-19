var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Import routes
var indexRouter = require('./routes/index');
var usersettingsRouter = require('./routes/user-settings');
var articleRouter = require('./routes/article');
var favoritesRouter = require('./routes/favorites');
var weatherwidgetRouter = require('./routes/weatherwidget');

//Backend Connection
require('./models/connection');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'reactapp/build')));

// Routes : index, user-settings, articles, weatherwidget
app.use('/', indexRouter);
app.use('/user-settings', usersettingsRouter);
app.use('/article', articleRouter);
app.use('/favorites', favoritesRouter);
app.use('/weatherwidget', weatherwidgetRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log('L O C K E D  &  L O A D E D');
module.exports = app;