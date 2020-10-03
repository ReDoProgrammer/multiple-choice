const router = require('express').Router();
const User = require('../../models/user-model');
const middleware = require('../../middlewares/middleware');

router.get('/profile',middleware.isAdmin,(req,res)=>{
  let id =  req.param.id;
  console.log(id);
  res.render('user/index',{layout:'admin-layout'});
});
module.exports = router;
