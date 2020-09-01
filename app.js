var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var disheRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

var mongoose = require('mongoose');

var Dishes = require('./models/dishes');
var url = 'mongodb://localhost:27017/conFusion';

mongoose.connect(url)
  .then((db) => {
    console.log('connected to db');
  }, (err) => console.log(err))

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('super-secret-key'));

function auth(req, res, next) {
  var reqHeaderAuth = req.headers.authorization;

  if (!req.signedCookies.user) {
    if (!reqHeaderAuth) {
      var error = new Error('You are not authenticated')
      res.setHeader('WWW-Authenticate', 'Basic');
      error.statusCode = 401;
      return next(error);
    }
    var auth = new Buffer.from(reqHeaderAuth.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
  
    if (username === 'admin' && password === 'password') {
      res.cookie('user', 'admin', { signed: true });
      next();
    } else {
      var error = new Error('You are not authenticated')
      res.setHeader('WWW-Authenticate', 'Basic');
      error.statusCode = 401;
      return next(error);
    }
  } else {
    if (req.signedCookies.user === 'admin') {
      next();
    } else {
      var error = new Error('You are not authenticated')
      error.statusCode = 401;
      return next(error);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', disheRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

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

module.exports = app;
