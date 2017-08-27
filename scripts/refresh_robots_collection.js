// restore robots table based on file

db = connect('localhost:27017/robot-directory');

// clean out the robots collection
db.robots.deleteMany({});
// clean out the usernames and passwords from users collection
db.users.deleteMany({});
