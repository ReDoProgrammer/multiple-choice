/*
//FACEBOOK AUTHENTICATE
*/
const router = require('express').Router();
const User = require('../../models/user-model');
const passport = require('passport');//#1
const common = require('../../common/common');
FacebookStrategy = require('passport-facebook').Strategy;//#2

router.get('/auth/',(req,res)=>{
  res.render('facebook',{layout:'user-layout',user:req.session.user});
});
//#3
router.get('/auth/facebook',passport.authenticate('facebook'),(req,res)=>{});
router.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/' }),function(req, res){
  res.redirect('/account');
});

//#4
router.get('/account', ensureAuthenticated, function(req, res) {
  let id = req.user.id;
  //tìm kiếm trong csdl xem đã tồn tại user có username = id của user facebook hay chưa
  User.findOne({username:id},function(err,user){
    if(err){
      console.log('find user failed in facebook auth: '+new Error(err));
    }else{
      if(user){
        //if facebook account already exist in database
        //asign session user = user found
        req.session.user = user;
        res.redirect('/');
      }else{//create new one if not alredy exist
        User.create({
          username:id,
          fullname:req.user.displayName,
          avatar:req.user.photos[0].value,
          member_code:common.MemberCode()
        },function(err,usr){
          if(err){
            console.log('create user via facebook user failed: '+new Error(err));
          }else{
            req.session.user = usr;
            res.redirect('/');
          }
        });
      }
    }
  });
});

//middleware dùng để kiểm duyệt auth facebook
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
};

module.exports = router;
