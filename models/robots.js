const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
ObjectId = require('mongodb').ObjectID;

mongoose.Promise = require('bluebird');

const robotsSchema = new mongoose.Schema({
    id: { type: String },
    username: { type: String },
    name: { type: String },
    avatar: { type: String },
    email: { type: String },
    university: { type: String },
    job: { type: String },
    company: { type: String },
    skills: [],
    phone: { type: String },
    address: {
      street_num: { type: String },
      street_name: { type: String },
      city: { type: String },
      state_or_province: { type: String },
      postal_code: { type: String },
      country: { type: String }
    }
});

robotsSchema.plugin(findOrCreate);

const Robot = mongoose.model('Robot', robotsSchema);

module.exports = Robot;
