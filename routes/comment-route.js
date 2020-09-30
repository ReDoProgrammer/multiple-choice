const router = require('express').Router();
const config = require('../configs/config');
const Comment = require('../models/comment-model');

router.get('/',(req,res)=>{
  let page = req.query.page;

  Comment.find({})
  .sort({created_at:-1})
  .sort({like:-1})
  .sort({dislike:1})
  .skip(((page-1)*config.commentSize))
  .limit(config.commentSize)
  .exec(function(err,comment){
    if(err){
      res.send({code:500,msg:'Load comment failed:' + new Error(err)});
    }else{
      res.send({code:200,comment:comment,msg:'Load comment successfully',user:req.session.user});
    }
  });
});

router.get('/total-pages',(req,res)=>{
  Comment.countDocuments({},function(err,total){
    if(err){
      res.send({code:500,msg:'load comment total page failed: '+new Error(err)});
    }

    pages = total%config.commentSize==0? total/config.commentSize:Math.ceil( total/config.commentSize );

    res.send({code:200,msg:'load comment total page succesffully',pages:pages});
  });
});

router.post('/create',(req,res)=>{
  let email = req.body.email;
  let fullname = req.body.fullname;
  let content = req.body.content;
  Comment.create({
    email:email,
    fullname:fullname,
    content:content
  },function(err,cmt){
    if(err){
      res.send({code:500,msg:'create comment failed: '+new Error(err)});
    }
    res.send({code:200,msg:'create comment successfully',cmt:cmt});
  })

});

router.delete('/delete',(req,res)=>{

});

router.post('/like',(req,res)=>{

});

router.post('dislike',(req,res)=>{

});

module.exports = router;
