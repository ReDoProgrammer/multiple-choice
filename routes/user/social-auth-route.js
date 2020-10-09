/*
  router này dùng để xử lý việc đăng ký hoặc đăng nhập bằng mạng xã hội: facebook,google,...
*/
const router = require('express').Router();
const User = require('../../models/user-model');
const passport = require('passport');//#1
const common = require('../../common/common');

router.get('/facebook/register-or-login',(req,res)=>{
  let {id,name,avatar} = req.query;
  console.log({id,name,avatar});
});

module.exports = router;
