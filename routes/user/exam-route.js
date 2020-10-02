const router = require('express').Router();
const config = require('../../configs/config');
const Question = require('../../models/question-model');
const Group = require('../../models/group-model');
const Subject = require('../../models/subject-model');


router.get('/',(req,res)=>{
  
});

router.get('/random-questions',(req,res)=>{
  let questionNumber = config.questionNumber;
  let group = req.query.group;
  let subject = req.query.subject;
  Subject.findOne({meta:subject},function(err,s){
    if(err){
      res.send({code:500,type:'danger',msg:'can not find subject '+new Error(err)});
    }else{
      Question.findRandom({subject:s._id}, {}, {limit: questionNumber}, function(err, results) {
        if (err) {
          res.send({code:500,type:'danger',msg:'can not get random question: '+new Error(err)});
        }else{
          res.send({code:200,type:'success',msg:'get random questions successfully',questions:results});
        }

      });
    }
  });


});

module.exports = router;
