const router = require('express').Router();
const User = require('../models/user-model');

router.post('/logout',(req,res)=>{
  req.session.destroy(function(err) {
    if(err){
      console.log('Lỗi đăng xuất tài khoản của thành viên: ',new Error(err));
    }
     res.send({msg:'Đăng xuất thành công',code:200});
  });
});

router.post('/register',(req,res)=>{
  let username = req.body.username;
  let password = req.body.password;
  let fullname = req.body.fullname;
  User.create({
    username:username,
    password:password,
    fullname:fullname
  },function(err,user){
    if(err){
      console.log('register account failed: ',new Error(err));
      res.send({code:500,msg:'Đăng ký tài khoản thất bại'});
    }else{
      req.session.user = user;
      res.send({msg:'Đăng ký tài khoản thành công. Bạn sẽ được tự động đăng nhập',code:200});
    }
  });
});


router.get('/profile',(req,res)=>{
  if(req.session.user){
    res.send({user:req.session.user});
  }
});

router.post('/login',(req,res)=>{
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({ username: username }, function(err, user) {
    if (err) {
      console.log('error login: ', new Error(err));
    };
    if(user){
      // test a matching password
      user.ComparePassword(password, function(err, isMatch) {
        if (err) throw err;
        if(isMatch){
          req.session.user = user;
          res.send({msg:'Đăng nhập thành công',type:'txt-success',user:user});
        }else{
          res.send({msg:'Mật khẩu không chính xác. Vui lòng kiểm tra lại',type:'txt-warning'});
        }
      });

    }else{
      res.send({msg:'Tài khoản không đúng. Vui lòng kiểm tra lại',type:'warning'})
    }

  });
});

router.get('/count',(req,res)=>{
  User.countDocuments({},function(err,total){
    if(err){
      res.send({code:500,msg:'Thống kê thành viên thất bại:'+new Error(err)});
    }else{
      res.send({code:200,msg:'Thống kê số thành viên thành công',count:total});
    }

  });
})
module.exports = router;
