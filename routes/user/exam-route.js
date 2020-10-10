const router = require('express').Router();
const config = require('../../configs/config');
const Question = require('../../models/question-model');
const Group = require('../../models/group-model');
const Subject = require('../../models/subject-model');


router.get('/',(req,res)=>{
  let group = req.query.group;
  let subject = req.query.subject;
  Group.findOne({meta:group},function(err,gr){
    if(err){
      console.log('home view error when find group: '+new Error(err));
    }else{
      if(!gr){
        res.render('404',{layout:'404',msg:group+' không tồn tại'});
      }else{
        Subject.findOne({meta:subject},function(err,sb){
          if(err){
            console.log('find subject in home->view failed: '+new Error(err));
          }else{
            if(!sb){
              res.render('404',{layout:'404',msg:'môn '+subject+' không tồn tại'});
            }else{
              res.render('exam/index',{layout:'user-layout',user:req.session.user,group:gr,subject:sb});
            }
          }
        })
      }
    }
  })
});

router.get('/random-questions',(req,res)=>{
  let questionNumber = config.questionNumber;
  let subject = req.query.subject;
  Question.aggregate([
    {$match: {subject: subject,is_actived:true}},
    {$sample: {size: 55}}
  ], function(err, questions) {
    if(err){
      console.log('get random questions failed: '+new Error(err));
    }else{
      res.send({code:200,type:'success',msg:'get random questions successfully',questions:questions});
    }
  });
});

module.exports = router;
