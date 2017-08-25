let users = require('./users.js');

users.users.forEach( (user) => {
  console.log(JSON.stringify(user));
});
