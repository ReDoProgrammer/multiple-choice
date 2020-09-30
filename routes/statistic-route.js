const router = require('express').Router();
const Statistic = require('../models/statistic-model');

router.get('/init',(req,res)=>{
  Statistic.findOne({},function(err,st){
    if(err) console.log('init statistic failed: ',err);
    Statistic.findOneAndUpdate({},{
      exam_times:(st.exam_times+200),
      visitors_count:(st.visitors_count+100)
    },function(err,st){
      if(err) console.log('update statistic in init failed: '+err);
      console.log('initial statistic successfully');
    })
  })
});

//trả về dữ liệu thống kê
router.get('/',(req,res)=>{
  //khởi tạo dữ liệu thống kê trong trường hợp chưa có
  Statistic.countDocuments({}, function( err, total){
    if(!err && total == 0){
      Statistic.create({
        exam_times:0,
        visitors_count:0,
        current_visitors:0
      },function(e,st){
        if(!e){
          Statistic.findOne({},function(err,st){
            res.send({st:st});
          });
        }
      });
    }else{
      Statistic.findOne({},function(err,st){
        res.send({st:st});
      });
    }
  });



});

//tăng lượt làm bài khi click vào nút "bắt đầu làm bài trên view exam/index"
router.post('/increase-exam-times',(req,res)=>{
  Statistic.findOne({},function(err,st){
    Statistic.findOneAndUpdate({},{
      exam_times: ++st.exam_times
    },{
      new:true
    },function(err,st){
      if(!err){
        res.send({msg:st.exam_times})
      }
    });
  });
});

router.post('/update-visitor-count',(req,res)=>{
  Statistic.findOne({},function(err,st){
    Statistic.findOneAndUpdate({},{
      visitors_count: ++st.visitors_count
    },function(err,st){
      if(!err){
        res.send({msg:st.visitors_count});
      }
    });
  });
});




module.exports = router;
