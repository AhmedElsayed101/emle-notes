var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();


var indexRouter = require('./routes/index');
const parentRouter = require('./routes/emle/parents')
const usersRouter = require('./routes/emle/users')


const passport = require('passport')


var app = express();




// var corsOptions = {
//   origin: "http://localhost:3000"
// };

app.use(cors());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// set db
const db = require("./models/index");
db.sequelize.sync();
// db.sequelize.sync({ force: true })
// .then(() => {
//   console.log("Drop and re-sync db.");
// }).catch((err) => console.log('err', err))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cookieParser());
app.use(passport.initialize())


app.use('/', indexRouter);
app.use('/api/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/parents', parentRouter)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  res.status(err.status || 500);
  res.json({
    err : err.message,
    success : false
  });
});

module.exports = app;
