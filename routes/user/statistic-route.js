/*
  MODULE NÀY DÙNG ĐỂ XỬ LÝ THỐNG KÊ KẾT QUẢ LÀM BÀI CỦA THÀNH VIÊN
*/
const router = require('express').Router();
const Group = require('../../models/group-model');
const Subject = require('../../models/subject-model');
const Statistic = require('../../models/statistic-model');
const middleware = require('../../middlewares/middleware');

router.post('/push',middleware.isLoggedIn,(req,res)=>{
  let {group,subject,ratio} = req.body;
  Group.findOne({meta:group},function(err,gr){
    if(err){
      console.log('find group in statistic/push failed: '+new Error(err));
    }else{
      if(gr){//if group exists
        Subject.findOne({group:gr._id,meta:subject},function(err,sbj){
          if(err){
            console.log('find subject in statistic/push failed: '+new Error(err));
          }else{
            if(sbj){//if subject exists
              Statistic.findOne({subject:sbj._id,user:req.session.user._id},function(err,stt){
                if(err){
                  console.log('find statistic in statistic/push failed: '+new Error(err));
                }else{
                  if(stt){//if exist
                    Statistic.findOneAndUpdate({_id:stt._id},{
                      $push:{ratio:ratio}
                    },function(err,s){
                      if(err){
                        console.log('push statistic failed: '+new Error(err));
                      }else{
                        res.send({code:200,msg:'push statistic successfully'});
                      }
                    });
                  }else{//if not exist, create new one
                    Statistic.create({
                      user:req.session.user._id,
                      subject:sbj._id,
                      ratio:ratio
                    },function(err,statistic){
                      if(err){
                        console.log('create new statistic failed: '+new Error(err));
                      }else{
                        sbj.statistics.push(statistic);
                        sbj.save();
                        res.send({code:200,msg:'push new statistic successfully'});
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  })
});
router.get('/profile',middleware.isLoggedIn,(req,res)=>{
  Group.find({})
  .select('name -_id')
  .populate({path:'subjects',select:'name',populate:{path:'statistics',match:{user:req.session.user._id}}})
  .exec(function(err,dt){
    if(err){
      console.log('/statistic/profile failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'get profile in statistic successfully',statistics:dt});
    }
  })
});

router.get('/ranks',(req,res)=>{
  let subjectId = req.query.subjectId;
  Statistic.find({subject:subjectId})
  .sort({ratio:-1})
  .populate('user','avatar member_code')
  .exec(function(err,ranks){
    if(err){
      console.log('ranking failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'ranking successfully',ranks:ranks});
    }
  });
});



module.exports = router;
