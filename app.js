const express = require('express'),
      mustacheExpress = require('mustache-express'),
      morgan = require('morgan'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      bodyParser = require('body-parser'),
      session = require('express-session'),
      mongoDBStore = require('connect-mongodb-session')(session),
      ejs = require('ejs');

// app-level connect to robot-directory database
// used for robot directory info and auth for passport
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/robot-directory', {useMongoClient: true});

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));


// routes
let users = require('./routes/users.js');
let auth = require('./routes/auth.js');

// the schema for auth
let User = require('./models/auth.js');

app.use(express.static('public'));
app.use(morgan('tiny'))

app.set('views', './views');
app.set('view engine', 'ejs');

passport.use(new LocalStrategy(function(username, password, done) {
    console.log(`in passport LocalStrategy`);
    User.findOne({username: username,
    }, function(err, user) {
      if(err) {
        return done(err);
      }

      if(!user) {
        return done(null, false, {message: 'incorrect username'});
      }

      if( !user.authenticate(password) ) {
        return done( null, false, {message: 'incorrect password'} );
      }

      return done(null, user);
    })
}));

passport.serializeUser(function(user, done) {
  console.log('in serializeUser');
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  console.log('in deserializeUser');
  User.findById(id, function(err, user) {
    done(err, user);
  })
});

// set up the express-session store to use MongoDB
// this allows us to kill the server and still have session data available
let store = new mongoDBStore(
  {
    uri: 'mongodb://localhost:27017/robot-directory',
    collection: 'session-store'
  }
);

store.on('error', (e) => {
  assert.ifError(e);
  assert.ok(false);
});

// set up express-session
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 //1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', users);
app.use('/', auth);

app.listen(3000, () => {
  console.log('Listening on 3000.');
})
