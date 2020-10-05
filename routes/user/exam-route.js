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
  let group = req.query.group;
  let subject = req.query.subject;
  Subject.findOne({meta:subject},function(err,s){
    if(err){
      res.send({code:500,type:'danger',msg:'can not find subject '+new Error(err)});
    }else{
      // Question.findRandom({subject:s._id}, {}, {limit: questionNumber}, function(err, results) {
      //   if (err) {
      //     res.send({code:500,type:'danger',msg:'can not get random question: '+new Error(err)});
      //   }else{
      //     res.send({code:200,type:'success',msg:'get random questions successfully',questions:results});
      //   }
      // });


      // Question.countDocuments({subject:s._id},function(err,count){
      //   let random = Math.floor(Math.random() * (count-55));
      //   Question.find({subject:s._id})
      //   .skip(random)
      //   .limit(55)
      //   .exec(function(err,questions){
      //      res.send({code:200,type:'success',msg:'get random questions successfully',questions:questions});
      //   })
      //
      // });

      Question.aggregate([
          {$match: {subject: s._id,is_actived:true}},
          {$sample: {size: 55}}
      ], function(err, questions) {
          // const unique = Array.from(new Set(questions));
          // console.log(unique.length);
          if(err){
            console.log('get random questions failed: '+new Error(err));
          }else{
            res.send({code:200,type:'success',msg:'get random questions successfully',questions:questions});
          }          
      });
    }
  });


});

module.exports = router;
