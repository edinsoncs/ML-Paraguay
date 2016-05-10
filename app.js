var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressSession = require('express-session');

var mongo = require('mongodb');

var mongoose = require('mongoose');



var monk = require('monk');
var db = monk('localhost:27017/milleniacapital');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');

var panel = require('./routes/panel');
var listado = require('./routes/listado');
var fallo = require('./routes/fallo');

var fileupload = require('./routes/fileupload');


var app = express();


app.use(function(req, res, next){
  req.db = db;

  console.log('Conectamos a la base de datos');

  next();

});

mongoose.connect('mongodb://localhost:27017/milleniacapital');


app.use(expressSession({ 
  secret: 'ilovescotchscotchyscotchscotch',  
  resave: false, 
  saveUninitialized: true, 
  cookie:{
     maxAge : 360000000000 // one hour in millis
   }
 }));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session());


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/fallo');
  }

}


app.use('/', routes);

app.use('/users', users);

app.use('/panel', ensureAuthenticated, panel);
app.use('/listado', ensureAuthenticated, listado);

app.use('/fileupload', fileupload);




var Schema = mongoose.Schema;

var UserDetail = new Schema({
  username: String,
  password: String
}, {
  collection: 'usuarios'
});


var UserDetails = mongoose.model('usuarios', UserDetail);



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



passport.use(new LocalStrategy(function(username, password, done) {
      process.nextTick(function() {
        UserDetails.findOne({
          'username': username
        }, function(err, user) {
          if (err) {
            return done(err);
          }

          if (!user) {
            console.log('ocurrio un error');
            return done(null, false);
          }

          if (user.password != password) {
            console.log('hubo un error en la cuenta');
            return done(null, false);
          }

          return done(null, user);
        });
      });

    }));

//Set Login
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/panel',
    failureRedirect: '/fallo'
  })
);


app.use('/fallo', fallo);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
