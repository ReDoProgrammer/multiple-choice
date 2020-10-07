const router = require('express').Router();
const config = require('../../configs/config');
const middleware = require('../../middlewares/middleware');
const Comment = require('../../models/comment-model');

router.get('/list',(req,res)=>{
  const {page,group,subject} = req.query;
  let commentSize = config.commentSize;
  Comment.countDocuments({
    group:group,
    subject:subject
  },function(err,count){
    if(err){
      console.log('count comments failed: '+new Errror(err));
    }else{
      if(page*commentSize<=count){
        Comment.find({
          group:group,
          subject:subject
        })
        .populate('user','fullname avatar')
        .populate('replies','reply')
        .sort({created_at:-1})
        .skip((page-1)*commentSize)
        .limit(commentSize)
        .exec(function(err,comments){
          if(err){
            console.log('get comments failed: '+new Error(err));
          }else{
            res.send({code:200,msg:'Load comments successfully',comments:comments});
          }
        });
      }
    }
  });
});

router.post('/create',middleware.isLoggedIn,(req,res)=>{
  let user = req.session.user._id;
  let group = req.body.group;
  let subject = req.body.subject;
  let comment = req.body.comment;
  Comment.create({
    group:group,
    subject:subject,
    user:user,
    comment:comment
  },function(err,cmt){
    if(err){
      console.log('create comment failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'created comment successfully'});
    }
  });

});

router.post('/reply',middleware.isLoggedIn,(req,res)=>{

});
router.post('/update',middleware.isLoggedIn,(req,res)=>{

});
router.post('/like',middleware.isLoggedIn,(req,res)=>{

});

router.delete('/delete',middleware.isLoggedIn,(req,res)=>{

});

router.get('/check-logged-in',(req,res)=>{
  if(req.session.user){
    res.send({code:200,msg:'user is current logged in'});
  }else{
    res.send({code:100,msg:'guest visit this page'});
  }
});

module.exports = router;
