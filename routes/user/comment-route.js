const router = require('express').Router();
const config = require('../../configs/config');
const middleware = require('../../middlewares/middleware');
const Comment = require('../../models/comment-model');
const Reply = require('../../models/reply-model');

router.get('/list',(req,res)=>{
  const {page,group,subject} = req.query;

  let commentSize = config.commentSize;
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

router.get('/detail',(req,res)=>{
  let id = req.query.id;
  Comment.findById(id,(err,comment)=>{
    if(err){
      console.log('find comment by id failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'get comment by id successfully',comment:comment});
    }
  });
});

router.get('/notification',(req,res)=>{
  let {id,user} = req.query;
  console.log({id,user});
  Reply.find({
    comment:id,
    user:user
  })
  .populate({path:'user',select:'fullname username avatar'})
  .sort({'created_at':-1})
  .limit(1)
  .populate({path:'comment',populate:{path:'user',select:'fullname avatar username'}})
  .exec(function(err,replies){
    if(replies.length == 1){
      let reply = replies[0];
      if(req.session.user.username == reply.comment.user.username){
        res.send({code:200,msg:'someone has just replied a comment',reply:reply});
      }else{
        console.log('you have just reply your own comment');
      }
    }

  });
});

module.exports = router;
