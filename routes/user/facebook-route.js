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
  let id = req.user.id;
  User.findOne({username:id},function(err,user){
    if(err){
      console.log('find user failed in facebook auth: '+new Error(err));
    }else{
      if(user){
        //if facebook account already exist in database
        //asign session user = user found
        req.session.user = user;
      }else{
        User.create({
          username:id,
          fullname:req.user.displayName,
          avatar:req.user.photos[0].value
        },function(err,usr){
          if(err){
            console.log('create user via facebook user failed: '+new Error(err));
          }else{
            req.session.user = usr;
            res.render('home/index');
          }
        });
      }
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
};

module.exports = router;
