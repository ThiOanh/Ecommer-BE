const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const passport = require('passport');

const indexRouter = require('./routes/index');

const productRouter = require('./routes/product/router');
const categoryRouter = require('./routes/category/router');
const supplierRouter = require('./routes/supplier/router');
const customerRouter = require('./routes/customer/router');
const employeeRouter = require('./routes/employee/router');
const authRouter = require('./routes/auth/router');

const orderRouter = require('./routes/order/router');
const cartRouter = require('./routes/cart/router');
const questionsRouter = require('./routes/questions/router');
const mediaRouter = require('./routes/upload');

const {
  passportVerifyToken,
  passportVerifyAccount,
  passportConfigBasic,
} = require('./middlewares/passport');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add CORS here
app.use(
  cors({
    origin: '*',
  }),
);

mongoose.connect(`${process.env.DATABASE_URL}${process.env.DATABASE_NAME}`);

passport.use(passportVerifyToken);
passport.use(passportVerifyAccount);
passport.use(passportConfigBasic);

app.use('/', indexRouter);

app.use('/products', passport.authenticate('jwt', { session: false }), productRouter);
app.use('/categories', passport.authenticate('jwt', { session: false }), categoryRouter);
app.use('/suppliers', passport.authenticate('jwt', { session: false }), supplierRouter);
app.use('/cart', cartRouter);
app.use('/customers', passport.authenticate('jwt', { session: false }), customerRouter);
app.use('/employees', passport.authenticate('jwt', { session: false }), employeeRouter);
app.use('/auth', authRouter);
app.use('/orders', passport.authenticate('jwt', { session: false }), orderRouter);
app.use('/media', passport.authenticate('jwt', { session: false }), mediaRouter);

app.use('/questions', questionsRouter);

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
