const router = require('express').Router();
const Question = require('../../models/question-model');
const User = require('../../models/user-model');
const middleware = require('../../middlewares/middleware');
const config = require('../../configs/config');

router.get('/',middleware.isAdmin,(req,res)=>{
  res.render('question/index',{layout:'admin-layout'});
});

/*
  Mỗi user có thuộc tính contributed_question dùng để đánh dấu quyền đóng góp câu hỏi, mặc định có giá trị:true
  trong trường hợp spam nhiều quá, admin sẽ khóa tính năng này lại -> false
  trước khi thêm câu hỏi, cần kiểm tra xem người này có được quyền đóng góp câu hỏi hay không
*/
router.post('/add',middleware.isLoggedIn,(req,res)=>{
  User.findOne({_id:req.session.user._id},function(err,usr){
    if(err){
      console.log('find user by id failed: '+new Error(err));
    }else{
      if(usr.contributed_question==false){
        res.send({code:401,msg:'Tài khoản của bạn đã bị khóa chức năng đóng góp câu hỏi'});
      }else{
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
          subject:subject,
          created_by:req.session.user._id,
          is_actived:req.session.user.is_admin?true:false
        },function(err,q){
          if(err){
            console.log('created question failed: '+new Error(err));
          }else{
            res.send({code:200,type:'success',msg: req.session.user.is_admin?'Đăng câu hỏi thành công':'Đăng câu hỏi thành công. Chân thành cảm ơn sự đóng góp của bạn'});
          }
        });
      }
    }
  });

});

router.post('/update',middleware.isAdmin,(req,res)=>{
  let {id,question,option_a,option_b,option_c,option_d,answer,description,subject} = req.body;
  Question.findOneAndUpdate({_id:id},{
    question:question,
    option_a:option_a,
    option_b:option_b,
    option_c:option_c,
    option_d:option_d,
    answer:answer,
    description:description,
    subject:subject
  },function(err,question){
    if(err){
      console.log('update question failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'Cập nhật câu hỏi thành công'});
    }
  });
})

router.delete('/delete',middleware.isAdmin,(req,res)=>{
  let id = req.body.id;
  Question.deleteOne({_id:id},function(err){
    if(err){
      console.log('delete a question failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'Xóa câu hỏi thành công'});
    }
  });
});

router.get('/list-with-conditions',(req,res)=>{
  let {page,subject,search,checked} = req.query;
  let pageSize = config.pageSize;
  let is_actived = checked=='true'?true:false;
  Question.find({
    subject:subject,
    question: { $regex: search, $options: "i" },
    is_actived:is_actived
  })
  .populate('created_by','fullname')
  .sort({question:1})
  .skip((page-1)*pageSize)
  .limit(pageSize)
  .exec(function(err,questions){
    if(err){
      console.log('list questions with conditions failed: '+new Error(err));
    }else{
      res.send({code:200,type:'success',msg:'Load questions successfully',questions:questions,pageSize:pageSize});
    }
  });

});

router.get('/detail',middleware.isAdmin,(req,res)=>{
  let id = req.query.id;
  Question.findById(id,function(err,question){
    if(err){
      console.log('find question by id failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'get question by id successfully',question:question});
    }
  });
});

router.get('/total-pages',middleware.isAdmin,(req,res)=>{
  let {subject,search,checked} = req.query;
  let is_actived = checked=='true'?true:false;
  let pageSize = config.pageSize;
  Question.countDocuments({
    subject:subject,
    question: { $regex: search, $options: "i" },
    is_actived:is_actived
  },function(err,count){
    if(err){
      console.log('get question total records failed: '+new Error(err));
    }else{
       let pages = count%pageSize==0? count/pageSize:Math.ceil( count/pageSize );
       res.send({code:200,pages:pages,msg:'load pages number successfully'});
    }
  });
});


module.exports = router;
