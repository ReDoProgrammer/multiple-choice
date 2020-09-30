/*
  class này dùng để thống kê mỗi thành viên
  có tỉ lệ trả lời câu hỏi tương ứng với mỗi luật là bao nhiêu
*/
const router = require('express').Router();
const StatisticUser = require('../models/statistic-user-model');

//middleware kiểm tra tài khoản đã đăng nhập hay chưa
const isLogin = function(req,res,next){
  if(req.session.user){
    next();
  }else{
    res.send({stt:null})
  }
}
router.get('/detail',isLogin,(req,res)=>{
  let legalId = req.query.legalId;

  //tìm kiếm thông tin thống kê trả lời của thành viên
  StatisticUser.findOne({username:req.session.user.username,legal:legalId},function(err,stt){
    if(err){
      console.log('find user statistic info failed: '+new Error(err));
    }
    //nếu dữ liệu của thành viên và của môn học đã tồn tại
    if(stt){
      //trả về dữ liệu tìm thấy
        res.send({stt:stt});
    }else{//nếu chưa có thông tin thống kê
      StatisticUser.create({
        lower_30_percents:0,
        from_30_to_50_percents: 0,
        from_50_70_percents: 0,
        uper_80_percents:0,
        uper_90_percents:0,
        equal_100_percents:0,
        legal:legalId,
        username:req.session.user.username
      },function(err,stt){
        if(err){
          console.log('Lỗi tạo thống kê trả lời của thành viên: '+new Error(err));
        }else{
          res.send({stt:stt});
        }
      });
    }
  });

});

//hàm cập nhật lại kết quả trả lời của thành viên
router.post('/update',isLogin,(req,res)=>{
    let legalId = req.body.legalId;
    let result = req.body.result;

    StatisticUser.findOne({username:req.session.user.username,legal:legalId},function(err,stt){
      if(err){
        console.log('Lỗi tìm thống kê kết quả trả lời của thành viên: '+new Error(err));
      }else{
        StatisticUser.findOneAndUpdate(
          {_id:stt._id}, {
          lower_30_percents:result<30?(++stt.lower_30_percents):stt.lower_30_percents,
          from_30_to_50_percents: (result>=30&&result<50)?(++stt.from_30_to_50_percents):stt.from_30_to_50_percents,
          from_50_70_percents: (result>=50 && result <70)?(++stt.from_50_70_percents):stt.from_50_70_percents,
          uper_80_percents:result>=80?(++stt.uper_80_percents):stt.uper_80_percents,
          uper_90_percents:result>=90?(++stt.uper_90_percents):stt.uper_90_percents,
          equal_100_percents:result==100?(++stt.equal_100_percents):stt.equal_100_percents,
        },function(er,rs){
          if(er){
            console.log('Lỗi cập nhật thống kê kết quả trả lời của thành viên: '+new Error(er));
          }
          res.send({code:200,msg:'Cập nhật thống kê kết quả trả lời thành công',type:'success',stt:rs});
        });
      }
    });

});

module.exports = router;
