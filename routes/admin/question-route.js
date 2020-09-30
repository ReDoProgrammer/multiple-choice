const router = require('express').Router();
const Question = require('../../models/question-model');
const middleware = require('../../middlewares/admin-middleware');

router.get('/',middleware.isAdmin,(req,res)=>{
  res.render('question/inex',{layout:'admin-layout'});
});


module.exports = router;
