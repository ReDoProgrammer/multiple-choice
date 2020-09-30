const router = require('express').Router();

router.get('/',(reg,res)=>{
  res.render('english/index');
})

module.exports = router;
