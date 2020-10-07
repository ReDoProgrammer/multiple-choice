const router = require('express').Router();
const passport = require('passport');
const config = require('../../configs/config');
const common = require('../../common/common');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/user-model');

passport.use(new GoogleStrategy({
  clientID: config.google_api.clientId,
  clientSecret: config.google_api.clientSecret,
  callbackURL: config.google_api.callbackURL
},function(accessToken, refreshToken, profile, done) {
  User.findOne({username:profile.id},function(err,u){
    if(err){
      console.log('find user in google auth failed: '+new Error(err));
    }else{
      if(u){
        return done(err, u);
      }else{
        User.create({
          username:profile.id,
          fullname:profile.displayName,
          avatar:profile.photos[0].value,
          member_code:common.MemberCode
        }, function (err, user) {
          if(err){
            console.log('find or create user failed: '+new Error(err));
          }else{
            return done(err, user);
          }
        });
      }
    }
  });

}
));


router.get('/auth/google',passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),function(req, res) {
  // Successful authentication, redirect home.
  req.session.user = req.user;
  res.redirect('/');
});


module.exports = router;
