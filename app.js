var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()

var gitaRouter = require('./routes/bhagavadGita');
var chanakyaRouter = require('./routes/chanakya');
var sloganRouter = require('./routes/sanskritSlogan');
var vidurRouter = require('./routes/vidurNiti');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bahgavad_gita', gitaRouter);
app.use('/api/v1/chanakya', chanakyaRouter);
app.use('/api/v1/sanskrit', sloganRouter);
app.use('/api/v1/vidur_niti', vidurRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource could not be found',
      documentationUrl: 'https://yourapi.com/docs', // Link to API documentation
    },
  });
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
