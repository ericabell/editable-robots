const express = require('express');
// const data = require('../models/users');
let data = {};
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let Robot = require('../models/robots.js');

let ObjectId = require('mongodb').ObjectId;


let encodeSkills = function(data) {
  let uniqueSkills = [];
  data = data.map((user)=> {
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
  console.log(req.user);
  Robot.find({})
    .then( (docs) => {
      // encode the skills
      docs = encodeSkills(docs);
      res.render('pages/directory', {users: docs});
    })
    .catch( (err) => {
      res.send(err);
    })
});

router.get('/employed', (req, res) => {
  Robot.find({job: {$ne: null}})
    .then( (docs) => {
      // encode the skills
      docs = encodeSkills(docs);
      res.render('pages/directory', {users: docs});
    })
    .catch( (err) => {
      res.send(err);
    })
});

router.get('/unemployed', (req, res) => {
  Robot.find({job: {$eq: null}})
    .then( (docs) => {
      // encode the skills
      docs = encodeSkills(docs);
      res.render('pages/directory', {users: docs});
    })
    .catch( (err) => {
      res.send(err);
    })
});

router.get('/country/:name', (req, res) => {
  Robot.find({country: {$eq: req.params.name}})
    .then( (docs) => {
      // encode the skills
      docs = encodeSkills(docs);
      res.render('pages/directory', {users: docs});
    })
    .catch( (err) => {
      res.send(err);
    })
})

router.get('/skill/:skillname', (req, res) => {
  // skill is going to come to us as URI encoded
  let searchSkill = decodeURIComponent(req.params.skillname);
  console.log(`Skill search: ${searchSkill}`);

  Robot.find({"skills": searchSkill})
    .then( (docs) => {
      // encode the skills
      docs = encodeSkills(docs);
      res.render('pages/directory', {users: docs});
    })
    .catch( (err) => {
      res.send(err);
    })
})

// display a single robot's entry, with edit button
router.get('/robot/:id', (req, res) => {
  let searchId = req.params.id;

  Robot.find({"_id": searchId})
    .then( (docs) => {
      // encode the skills
      docs = encodeSkills(docs);
      res.render('pages/directory', {users: docs});
    })
    .catch( (err) => {
      res.send(err);
    })
})

// display a single robot with editing (if authenticated)
router.get('/edit/:id', (req, res) => {
  res.send('edit a robot');
})


module.exports = router;
