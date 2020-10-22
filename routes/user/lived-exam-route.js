const router = require('express').Router();
const LivedRoom = require('../../models/lived-room-model');
const middleware = require('../../middlewares/middleware');

router.get('/',(req,res)=>{
  res.render('live/index',{layout:'user-layout'});
});

router.get('/check-login',(req,res)=>{
  if(req.session.user){
    res.send({code:200,msg:'user is already logged in',user:req.session.user});
  }else{
    res.send({code:401,msg:'user is not already login'});
  }
});

router.get('/permission',(req,res)=>{
  if(req.session.user && req.session.user.is_admin){
    res.send({code:200,msg:'you can create a live exam room'});
  }else{
    res.send({code:401,msg:'Rất tiếc! Tính năng này hiện tại chỉ cho phép admin thao tác.'});
  }
});

router.post('/create',(req,res)=>{
  if(req.session.user.is_admin){
    LivedRoom.create({

    })
  }else{
    res.send({code:401,msg:'Tính năng này hiện tại chỉ admin mới có quyền thao tác'});
  }
});

module.exports = router;
