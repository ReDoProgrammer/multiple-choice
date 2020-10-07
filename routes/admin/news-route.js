const router = require('express').Router();
const middleware = require('../../middlewares/middleware');
const News = require('../../models/news-model');


router.get('/',middleware.isAdmin,(req,res)=>{
  res.render('news/index',{layout:'admin-layout'});
});

module.exports = router;
