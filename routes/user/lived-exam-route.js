const router = require('express').Router();


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

module.exports = router;
