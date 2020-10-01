const router = require('express').Router();
const passport = require('passport');
const config = require('../../configs/config');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: config.google_api.clientId,
  clientSecret: config.google_api.clientSecret,
  callbackURL: config.google_api.callbackURL
},function(accessToken, refreshToken, profile, done) {
  console.log('profile:',profile);
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));


router.get('/auth/google',passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),function(req, res) {
  // Successful authentication, redirect home.
  console.log('callback',req.user);
  res.redirect('/');
});


module.exports = router;
