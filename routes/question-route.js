const router = require('express').Router();
const config = require('../configs/config');
const Question = require('../models/question-model');
var session = require('express-session');

const isAdmin = function(req,res,next){
  if(req.session.user && req.session.user.is_admin){
    next();
  }else{
    res.redirect('/admin/logout');
  }
}

router.get('/',isAdmin,(req,res)=>{
  res.render('question/index');
});

router.get('/detail',isAdmin,(req,res)=>{
  let id = req.query.id;
  Question.findById(id,function(err,ch){
    if(err){
      res.send({data:err});
    };
    res.send({ch:ch});
  });
});

router.get('/danh-sach/:page',isAdmin,(req,res)=>{
  let page = req.params.page;
  let key = req.query.key;
  let legalId = req.query.legalId;

  pageSize =  config.pageSize;
  Question.find({ question: { $regex: key, $options: "i" },legaldoc:legalId })
  .limit(pageSize)
  .skip((page-1)*pageSize)
  .exec(function(err,dsch){
    if(err){
      console.log(err);
    }
    res.send({dsch:dsch,pageSize:pageSize});
  });
});

router.post('/add',isAdmin,(req,res)=>{
  let question = req.body.question;
  let option_a = req.body.option_a;
  let option_b = req.body.option_b;
  let option_c = req.body.option_c;
  let option_d = req.body.option_d;
  let answer = req.body.answer;
  let remark = req.body.remark;
  let legalId = req.body.legalId;


  Question.create({
    question:question,
    answer:answer,
    option_a:option_a,
    option_b:option_b,
    option_c:option_c,
    option_d:option_d,
    remark:remark,
    legaldoc:legalId
  },function(err,ch ){
    if(err){
      res.send({ msg: 'Lỗi câu hỏi:'+err});
    }
    res.send({ msg: 'Thêm câu hỏi thành công!'});
  });

});


router.post('/update',isAdmin,(req,res)=>{
  let id = req.body.id;
  let question = req.body.question;
  let option_a = req.body.option_a;
  let option_b = req.body.option_b;
  let option_c = req.body.option_c;
  let option_d = req.body.option_d;
  let answer = req.body.answer;
  let remark = req.body.remark;
  Question.findOneAndUpdate({ _id:id},
    {
      question:question,
      answer:answer,
      option_a:option_a,
      option_b:option_b,
      option_c:option_c,
      option_d:option_d,
      remark:remark
    },function(err,ch){
    if(err){
      res.send({ msg: 'Lỗi câu hỏi:'+err});
    }
    res.send({msg:'Cập nhật câu hỏi thành công!'})
  });
});


router.delete('/delete/:id',isAdmin,(req,res)=>{
  let id =  req.params.id;
  Question.deleteOne({_id:id},()=>{
      res.send({msg:'Xóa câu hỏi thành công!'});
  });
});

//hàm trả về tổng số trang hiện có của dữ liệu
//với kích thước page là 20 records
router.get('/total-pages',(req,res)=>{
  let pageSize = config.pageSize;
  let legalId = req.query.legalId;
  let key = req.query.key;

  Question.countDocuments({ question: { $regex: key, $options: "i" },legaldoc:legalId }, function( err, total){
    /*
      số trang được tính theo nguyên tắc sau:
      nếu tổng số document tìm được chi hết cho kích thước của trang được lưu trong file config thì lấy kết quả chia hết đó
      ngược lại, lấy kết quả chia lấy nguyên + 1
    */

    let pages = total%pageSize==0? total/pageSize:Math.ceil( total/pageSize );
    res.send({pages:pages,pageSize:pageSize});
  });
});

module.exports = router;
