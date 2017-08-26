const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');

let User = require('./models/auth');

mongoose.connect('mongodb://localhost:27017/robot-directory', {useMongoClient: true});

let data = require('./robot_auth.js');

data.forEach( (user) => {
  User.create(user)
    .then( (doc) => {
      console.log(`user created: ${doc.name}`);
    })
    .catch( (err) => {
      console.log(`err: ${err}`);
    })
});
