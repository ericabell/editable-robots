const express = require('express');
// const data = require('../models/users');
let data = {};
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let Robot = require('../models/robots.js');

let ObjectId = require('mongodb').ObjectId;

// to protect certain routes, we need to apply some middleware
// I'm using a function called requireLogin
const requireLogin = function(req, res, next) {
  if(req.user) {
    next(); // we authenticate, so give the user what they want
  } else {
    // this is whatever we want to have happen if the user
    // is not authenticated.
    res.redirect('/login');
  }
}


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
      res.render('pages/directory', {users: docs, userInfo: req.user});
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
      res.render('pages/directory', {users: docs, userInfo: req.user});
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
      res.render('pages/directory', {users: docs, userInfo: req.user});
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
      res.render('pages/directory', {users: docs, userInfo: req.user});
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
      res.render('pages/directory', {users: docs, userInfo: req.user});
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
      res.render('pages/directory', {users: docs, userInfo: req.user});
    })
    .catch( (err) => {
      res.send(err);
    })
})

// display a single robot with editing (if authenticated)
// this is a protected route requires auth.

router.get('/edit/:id', requireLogin, (req, res) => {
  // TODO: logged in users can grab id of another user
  // and edit that user. Need to fix this.
  let searchId = req.params.id;

  Robot.find({"_id": searchId})
    .then( (docs) => {
      // make skills into a comma-separated list for the form
      let skillString = docs[0].skills.join(',');
      console.log(skillString);
      res.render('pages/edit', {users: docs, userInfo: req.user, skillString: skillString});
    })
    .catch( (err) => {
      res.send(err);
    })
})

router.post('/edit/:id', (req, res) => {
  let searchId = req.params.id;

  let newName = req.body.name;
  let newEmail = req.body.email || '';
  let newUniversity = req.body.university || '';
  let newJob = req.body.job || '';
  let newCompany = req.body.company || '';
  let newPhone = req.body.phone || '';

  let newSkills = req.body.skills.split(',') || '';

  Robot.findByIdAndUpdate(
      searchId,
      {
        $set: {name: newName,
               email: newEmail,
               university: newUniversity,
               job: newJob,
               company: newCompany,
               phone: newPhone,
               skills: newSkills}
      },
      {
        new: true
      },
      (err, doc) => {
          if(err) throw err;
          console.log(`Robot ${searchId} updated name to ${doc}`);
          res.redirect('/');
      }
  );
});


module.exports = router;
