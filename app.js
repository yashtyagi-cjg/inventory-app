var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var compression = require('compression');

var helmet = require('helmet');

mongoose.set("strictQuery", false);
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { mainModule } = require('process');
const { MongoKerberosError } = require('mongodb');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);
}


// app.use(compression);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

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


main().catch((err)=>console.log(err));
async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB")
}

module.exports = app;
