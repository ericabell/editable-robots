const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');

let User = require('../models/auth');

mongoose.connect('mongodb://localhost:27017/robot-directory', {useMongoClient: true});

let data = require('./data/robot_auth.js');

data.forEach( (user) => {
  User.create(user)
    .then( (doc) => {
      console.log(`user created: ${doc.name}`);
    })
    .catch( (err) => {
      console.log(`err: ${err}`);
    })
});


// code shouldn't take longer than 5 seconds...
setTimeout( () => {
  console.log('Records inserted');
  process.exit(0);
}, 5000);
