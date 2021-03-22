var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
const db = require("./models");
const cors = require('./utils/cors');

var uploadImage = require('./utils/upload-image');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users-router');
var dishRouter = require('./routes/dish-router');
var promoRouter = require('./routes/promotion-router');
var leaderRouter = require('./routes/leader-router');
//var favoriteRouter = require('./routes/favoriteRouter');
var commentRouter = require('./routes/comment-router');

var app = express();

app.use(cors.corsWithOptions);

db.sequelize.sync()
  .then(function() {
    console.log('Nice! Database looks fine')
  })
  .catch((err) => {
    next(err);
  });

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
 });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/imageUpload', uploadImage);

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
//app.use('/favorites', favoriteRouter);
app.use('/comments', commentRouter);

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
