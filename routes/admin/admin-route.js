const router = require('express').Router();
const User = require('../../models/user-model');
const Job = require('../../models/job-model');
const Comment = require('../../models/comment-model');
const common = require('../../common/common');
var session = require('express-session');

const isAdmin = function(req,res,next){
  if(req.session.user && req.session.user.is_admin){
    next();
  }else{
    res.redirect('/admin/login');
  }
}

router.get('/',isAdmin,(req,res)=>{
  res.render('admin/home',{layout:'admin-layout'});
});

router.get('/init',(req,res)=>{

  //Khởi tạo nghề nghiệp
  Job.countDocuments({},function(err,c){
    if(err){
      console.log('count job failed: '+new Error(err));
    }else{
      if(c == 0){
        const jobs = [
          {name:'Sinh viên'},
          {name:'Công nhân'},
          {name:'Bác sĩ'},
          {name:'Giáo viên'},
          {name:'Tài xế'},
          {name:'Doanh nhân'},
          {name:'Nông dân'},
          {name:'Khác'}
        ];
        Job.insertMany(jobs,function(err,rs){
          if(err){
            console.log('init jobs failed: '+new Error(err));
          }else{
            console.log('init jobs successfully');
          }
        });

      }
    }
  });

  // User.deleteMany({},function(err){
  //   console.log(1);
  // });
  // khởi tạo admin khi chưa có

  User.findOne({username:'redo'},function(err,ad){
    if(!ad){
      var ad = new User({
        username: 'redo',
        password: 'ReDo1@vn',
        fullname:'Nguyễn Hữu Trường',
        is_admin:true
      });

      // save user to database
      ad.save(function(err) {
        if (err) throw err;
        console.log(ad);
      });
    }else{
      console.log('admin is ready exists');
    }
  })

});

router.get('/destroy',(req,res)=>{
  Comment.deleteMany({},function(err){
    if(err){
      console.log('destroy all comments failed: '+new Error(err));
    }else{
      console.log('destroy all comments successfully');
    }
  })
});

router.get('/login',(req,res)=>{
  if(req.session.user && req.session.user.is_admin){
    res.redirect('/admin/');
  }
  res.render('admin/login',{ layout: 'admin/login' });
});

router.post('/login',(req,res)=>{
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({ username: username }, function(err, user) {
    if (err) {
      console.log('error login: ', new Error(err));
    };
    if(user){
      // kiểm tra mật khẩu khớp hay chưa
      user.ComparePassword(password, function(err, isMatch) {
        if (err){
          console.log(new Error('lỗi đăng nhập admin:',err));
          return;
        };
        // //nếu khớp mật khẩu
        if(isMatch){
          //kiểm tra có phải admin k
          if(user.is_admin){
            //set session khi đăng nhập thành công
            req.session.user = user;
            res.send({msg:'Bạn đăng nhập quản trị thành công',type:'success',user:user,url:'/admin/'});
          }else{
            console.log(0);
          }
        }else{//nếu không khớp mật khẩu
          res.send({msg:'Mật khẩu không chính xác. Vui lòng kiểm tra lại',type:'warning'});
        }
      });
    }else{
      res.send({msg:'Tài khoản không đúng. Vui lòng kiểm tra lại',type:'warning'});
    }
  });
});

router.get('/logout',(req,res)=>{
    req.session.destroy(function(err) {
       res.redirect('/admin/login');
   });
});





module.exports = router;
