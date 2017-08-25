const express = require('express');
// const data = require('../models/users');
let data = {};
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let ObjectId = require('mongodb').ObjectId;

// collection name is robots
let url = 'mongodb://localhost:27017/test';

let findUsers = function(callback) {
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let collection = db.collection('robots');
    collection.find({}).toArray( (err, docs) => {
      assert.equal(err, null);
      console.log(`Found user records`);
      callback(docs);
    });
  });
}

let findEmployedUsers = function(callback) {
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let collection = db.collection('robots');
    collection.find({job: {$ne: null}}).toArray( (err, docs) => {
      assert.equal(err, null);
      console.log(`Found user records`);
      callback(docs);
    });
  });
}

let findUnEmployedUsers = function(callback) {
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let collection = db.collection('robots');
    collection.find({job: {$eq: null}}).toArray( (err, docs) => {
      assert.equal(err, null);
      console.log(`Found user records`);
      callback(docs);
    });
  });
}

let findEmployeesByCountry = function(country, callback) {
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let collection = db.collection('robots');
    collection.find({"address.country": {$eq: country}}).toArray( (err, docs) => {
      assert.equal(err, null);
      console.log(`Found user records`);
      callback(docs);
    });
  });
}

let findEmployeesBySkill = function(skill, callback) {
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let collection = db.collection('robots');
    collection.find({"skills": skill}).toArray( (err, docs) => {
      assert.equal(err, null);
      console.log(`Found user records`);
      callback(docs);
    });
  });
}

let findEmployeesById = function(searchId, callback) {
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let collection = db.collection('robots');
    console.log(`searchId is: ${searchId}`);
    collection.find({"_id": ObjectId(searchId)}).toArray( (err, docs) => {
      assert.equal(err, null);
      console.log(`Found user records`);
      callback(docs);
    });
  });
}

let encodeSkills = function(data) {
  let uniqueSkills = [];
  data.users = data.users.map((user)=> {
    let listOfSkills = user.skills; // array of skills
    let newSkillsList = [];
    listOfSkills.forEach( (skill) => {
      if( uniqueSkills.indexOf(skill) >= 0 ) {
        console.log('Found duplicate skill: ' + skill);
      }
      newSkillsList.push({'text': skill, 'uri': encodeURIComponent(skill)});
    })
    user.skills = newSkillsList;
    return user;
  })
  return data;
}

let router = express.Router();

router.get('/', (req, res) => {
  findUsers( (docs) => {
    data.users = docs;
    // encode the skills
    data = encodeSkills(data);
    console.log(data);
    res.render('pages/directory', {users: data.users});
  });
});

router.get('/employed', (req, res) => {
  findEmployedUsers( (docs) => {
    data.users = docs;
    data = encodeSkills(data);
    res.render('pages/directory', {users: data.users});
  })
});

router.get('/unemployed', (req, res) => {
  findUnEmployedUsers( (docs) => {
    data.users = docs;
    data = encodeSkills(data);
    res.render('pages/directory', {users: data.users});
  })
});

router.get('/country/:name', (req, res) => {
  console.log(`Country search: ${req.params.name}`);
  let country = req.params.name
  findEmployeesByCountry( country, (docs) => {
    data.users = docs;
    data = encodeSkills(data);
    res.render('pages/directory', {users: data.users});
  })
})

router.get('/skill/:skillname', (req, res) => {
  // skill is going to come to us as URI encoded
  let searchSkill = decodeURIComponent(req.params.skillname);
  console.log(`Skill search: ${searchSkill}`);

  findEmployeesBySkill( searchSkill, (docs) => {
    data.users = docs;
    data = encodeSkills(data);
    res.render('pages/directory', {users: data.users});
  })
})

// display a single robot's entry, with edit button
router.get('/robot/:id', (req, res) => {
  let searchId = req.params.id;

  findEmployeesById(searchId, (docs) => {
    data.users = docs;
    data = encodeSkills(data);
    res.render('pages/directory', {users: data.users});
  })
})

// display a single robot with editing (if authenticated)
router.get('/edit/:id', (req, res) => {
  res.send('edit a robot');
})

module.exports = router;
