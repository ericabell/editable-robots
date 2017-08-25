const express = require('express');

let router = express.Router();

// USER AUTH ROUTES FOR LOGIN AND REGISTER
router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.post('/login', (req, res) => {
  // TODO: check user credentials
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  // TODO: logout passport
  res.redirect('/');
})

router.get('/register', (req, res) => {
  res.render('pages/register');
});

router.post('/register', (req, res) => {
  // TODO: create user credentials
  res.redirect('/');
})

module.exports = router;
