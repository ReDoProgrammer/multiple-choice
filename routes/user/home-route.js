const router = require('express').Router();

router.get('/',(req,res)=>{
  let group = req.query.group;
  let subject = req.query.subject;
  res.render('home/index',{layout:'user-layout',user:req.session.user,subject:null});
});



module.exports = router;
