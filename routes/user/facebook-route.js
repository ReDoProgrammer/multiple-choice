/*
  //FACEBOOK AUTHENTICATE
*/
const router = require('express').Router();
const User = require('../../models/user-model');
const passport = require('passport');
FacebookStrategy = require('passport-facebook').Strategy;

router.get('/auth/facebook',passport.authenticate('facebook'),  function(req, res){
});
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
});

router.get('/account', ensureAuthenticated, function(req, res) {
  console.log('account:',req.user);
  User.findOne({username:req.user.id},function(err,user){
    if(err){
      console.log('find user failed in facebook auth: '+new Error(err));
    }else{
      if(user){
        console.log(user);
      }else{
        console.log(user.id+' not exist');
      }
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
};

module.exports = router;
