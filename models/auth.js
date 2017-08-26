const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String }
});

const User = mongoose.model('User', userSchema);

// create a dummy user to test auth
user1 = new User({username: 'jay', password: 'jay'});

user1.save()
  .then( (docs) => {
    console.log(`user added: ${docs}`);
  })
  .catch( (err) => {
    console.log(`error adding user1`);
  })

module.exports = User;
