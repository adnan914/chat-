var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var Chat = require('./models/chats');

// var io = require("socket.io");
var app = express();
app.io = require('socket.io')();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });
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


app.io.on("connection", socket => {
  socket.on("Input Chate Message", msg => {
      try {
        let chat = new Chat({message: msg.chatMessage, sender_id: msg.userId, course_id: msg.course_id, batche_id: msg.batche_id, sender_name: msg.userName, type: msg.type})
        chat.save((err, doc) => {
          if (err) {console.log({ sucess: false })}

          return app.io.emit("Output Chat Message", doc);
        })
      } catch {
        console.error(error)
      }
  })
})

module.exports = app;
