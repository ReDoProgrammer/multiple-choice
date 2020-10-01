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
      console.log('find group failed: '+new Error(err));
    }else{
      if(!gr){
        res.render('404',{layout:'404',msg:'Bộ môn: '+group+' không tồn tại'});
      }else{
        Subject.findOne({meta:subject})
        .populate('group')
        .exec(function(err,sbj){
          if(err){
            console.log('find subject failed: '+new Error(err));
          }else{
            if(!sbj){
              res.render('404',{layout:'404',msg:'Môn '+subject+' không tồn tại',type:'danger'});
            }else{
              console.log('group:',gr,'subject:',sbj);
              res.render('exam/index',{layout:'user-layout',code:200,msg:'Lấy thông tin môn thành công',group:gr,subject:sbj,user:req.session.user});
            }
          }
        })

      }
    }
  });
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
