const router = require('express').Router();

router.get('/',(req,res)=>{
  let group = req.query.group;
  let subject = req.query.subject;
  res.render('home/index',{layout:'user-layout'});
});



module.exports = router;
