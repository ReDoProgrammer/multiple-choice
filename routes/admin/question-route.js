const router = require('express').Router();
const Question = require('../../models/question-model');
const middleware = require('../../middlewares/middleware');
const config = require('../../configs/config');

router.get('/',middleware.isAdmin,(req,res)=>{
  res.render('question/index',{layout:'admin-layout'});
});


router.post('/add',middleware.isAdmin,(req,res)=>{
  let question = req.body.question;
  let option_a = req.body.option_a;
  let option_b = req.body.option_b;
  let option_c = req.body.option_c;
  let option_d = req.body.option_d;
  let answer = req.body.answer;
  let description = req.body.description;
  let subject = req.body.subject;

  Question.create({
    question:question,
    option_a:option_a,
    option_b:option_b,
    option_c:option_c,
    option_d:option_d,
    answer:answer,
    description:description,
    subject:subject

  },function(err,q){
    if(err){
      res.send({code:500,type:'danger',msg:'creat question failed: '+new Error(err)});
    }
    res.send({code:200,type:'success',msg:'created question successfully'});
  });
});

router.get('/list-by-subject',(req,res)=>{
  let subject = req.query.subject;
  console.log(subject);
});

router.get('/list-with-conditions',(req,res)=>{
  let page = req.query.page;
  let subject = req.query.subject;
  let search = req.query.search;

  let pageSize = config.pageSize;
  console.log(pageSize);
  Question.find({
    subject:subject,
    question: { $regex: search, $options: "i" }
  })
  .sort({question:1})
  .skip((page-1)*pageSize)
  .limit(pageSize)
  .exec(function(err,questions){
    if(err){
      res.send({code:500,type:'danger',msg:'Load question failed: '+new Error(err)});
    }else{
      res.send({code:200,type:'success',msg:'Load questions successfully',questions:questions,pageSize:pageSize});
    }
  });

});


module.exports = router;
