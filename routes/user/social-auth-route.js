/*
  router này dùng để xử lý việc đăng ký hoặc đăng nhập bằng mạng xã hội: facebook,google,...
*/
const router = require('express').Router();
const User = require('../../models/user-model');
const passport = require('passport');//#1
const common = require('../../common/common');

router.get('/facebook/register-or-login',(req,res)=>{
  let {id,name,avatar} = req.query;
  User.findOne({username:id},function(err,user){
    if(err){
      console.log('find user auth with facebook failed: '+new Error(err));
    }else{
      if(user){
        req.session.user = user;
        res.send({code:200,msg:'Đăng nhập thành công!',user:user,isNew:false});
      }else{
        User.create({
          username:id,
          fullname:name,
          member_code:common.MemberCode(),
          avatar:avatar
        },function(err,user){
          if(err){
            console.log('create new user with facebook failed: '+new Error(err));
          }else{
            req.session.user = user;
            res.send({code:200,msg:'Đăng ký tài khoản thành công!',user:user,isNew:true});
          }
        })
      }
    }
  })
});

module.exports = router;
