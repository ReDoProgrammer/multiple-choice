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
              res.render('exam/index',{layout:'user-layout',code:200,msg:'Lấy thông tin môn thành công',subject:sbj});
            }
          }
        })

      }
    }
  });
});

router.get('/list',(req,res)=>{
//lấy thông tin số câu hỏi được hiển thị trong mỗi bài thi
//được lưu ở file configs.js
  let questionNumber = config.questionNumber;
  //lấy danh sách câu hỏi gồm questionNumber được lấy một cách ngẫu nhiên
  //hàm findRandom là 1 hàm của package: mongoose-simple-random
  //xem thêm trong models/Question-model.js
  let legalId = req.query.legalId;
  Question.findRandom({legaldoc:legalId}, {}, {limit: questionNumber}, function(err, results) {
    if (err) {
      console.log(err);
    }
    res.send({questions:results});
  });
});

module.exports = router;
