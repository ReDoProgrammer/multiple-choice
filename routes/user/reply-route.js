const router = require('express').Router();
const config = require('../../configs/config');
const middleware = require('../../middlewares/middleware');
const Comment = require('../../models/comment-model');
const Reply = require('../../models/reply-model');

router.get('/list',middleware.isLoggedIn,(req,res)=>{
  let commentId = req.query.commentId;
  Reply.find({comment:commentId})
  .populate('user')
  .sort({created_at:-1})
  .exec(function(err,replies){
    if(err){
      console.log('load replies failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'load replies successfully',replies:replies});
    }
  });
});

router.post('/create',middleware.isLoggedIn,(req,res)=>{
  let {commentId,reply} = req.body;
  Reply.create({
    reply: reply,
    user:req.session.user._id,
    comment:commentId
  },function(err,rp){
    if(err){
      console.log('create reply error: '+new Error(err));
    }else{
      Comment.findOneAndUpdate({_id:commentId},{$push:{replies:rp}},function(err,cmt){
        if(err){
          console.log('push reply into comment failed: '+new Error(err));
        }else{
          res.send({code:200,msg:'reply successfully'});
        }
      });
    }
  });
});

router.post('/update',middleware.isLoggedIn,(req,res)=>{

});
router.post('/like',middleware.isLoggedIn,(req,res)=>{

});

router.delete('/delete',middleware.isLoggedIn,(req,res)=>{

});

module.exports = router;
