/*
  //FACEBOOK AUTHENTICATE
*/
const router = require('express').Router();
const User = require('../../models/user-model');
const passport = require('passport');
FacebookStrategy = require('passport-facebook').Strategy;

router.get('/auth/facebook',passport.authenticate('facebook'),  function(req, res){
  console.log('/auth/facebook');
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
});
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    console.log('callback',req.user);
    res.redirect('/account');
});

router.get('/account', ensureAuthenticated, function(req, res) {
  console.log('account:',req.user);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
};

module.exports = router;
