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
                      times:(++stt.times),
                      equals_100: (ratio==100?(++stt.equals_100):stt.equals_100),
                      uper_90:((ratio>=90&&ratio<100)?(++stt.uper_90):stt.uper_90),
                      uper_80:((ratio>=80&&ratio<90)?(++stt.uper_80):stt.uper_80),
                      uper_70:((ratio>=70&&ratio<80)?(++stt.uper_70):stt.uper_70),
                      uper_50:((ratio>=50&&ratio<70)?(++stt.uper_50):stt.uper_50),
                      uper_30:((ratio>=30&&ratio<50)?(++stt.uper_30):stt.uper_30),
                      lower_30:(ratio<30?(++stt.lower_30):stt.lower_30),
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
                      equals_100: (ratio==100?1:0),
                      uper_90:((ratio>=90&&ratio<100)?1:0),
                      uper_80:((ratio>=80&&ratio<90)?1:0),
                      uper_70:((ratio>=70&&ratio<80)?1:0),
                      uper_50:((ratio>=50&&ratio<70)?1:0),
                      uper_30:((ratio>=30&&ratio<50)?1:0),
                      lower_30:(ratio<30?1:0),
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
router.get('/groups',middleware.isLoggedIn,(req,res)=>{
  try {
    Statistic.find({user:req.session.user._id})
    .distinct('subject',function(err,subjectids){
      Subject.find({_id:{$in:subjectids}})
      .distinct('group',function(err,groupids){
        if(err){
          console.log('statistic/groups distinct group failed: '+new Error(err));
        }else{
          Group.find({_id:{$in:groupids}},function(err,groups){
            if(err){
              console.log('statistic/groups find group failed: '+new Error(err));
            }else{
              res.send({code:200,msg:'get groups successfully',groups:groups});
            }
          });
        }
      });
    });
  } catch (e) {
    console.log('/statistic/groups exception: '+new Error(err));
  }
});
router.get('/subjects',middleware.isLoggedIn,(req,res)=>{
  let group = req.query.group;
  console.log('group id:',group);
  Statistic.find({user:req.session.user._id})
  .distinct('subject',function(err,subjectids){
    Subject.find({_id:{$in:subjectids},group:group},function(err,subjects){
      res.send({code:200,msg:'load subjects by group in statistic/subjects successfully',subjects:subjects});
    })
  });

});
router.get('/get-by-subject',middleware.isLoggedIn,(req,res)=>{
  Statistic.findOne({subject:req.query.subject,user:req.session.user._id},function(err,statistic){
    if(err){
      console.log('statistic/get-by-subject failed: '+new Error(err));
    }else{
      if(statistic){
        res.send({code:200,msg:'get statistic by subject successfully',statistic:statistic});
      }
    }
  });
});

router.get('/profile',(req,res)=>{
  Group.find({})
  .populate('subjects','name')
  .exec((err,groups)=>{
    console.log('aaa',groups);
  })
});

let groups = (userid) => {
  return new Promise((resolve,reject)=>{
    try {
      Statistic.find({user:userid})
      .distinct('subject',function(err,subjectids){
        Subject.find({_id:{$in:subjectids}})
        .distinct('group',function(err,groupids){
          if(err){
            return reject('statistic/groups distinct group failed: '+new Error(err));
          }else{
            Group.find({_id:{$in:groupids}},function(err,groups){
              if(err){
                return reject('statistic/groups find group failed: '+new Error(err));
              }else{
                return resolve({code:200,msg:'get groups successfully',groups:groups});
              }
            });
          }
        });
      });
    } catch (e) {
      return reject('/statistic/groups exception: '+new Error(e));
    }
  });
}

let subjects = (group,userid,arr)=>{

  return new Promise((resolve,reject)=>{
    try {
      Statistic.find({user:userid})
      .distinct('subject',function(err,subjectids){
        if(err){
          return reject('distinct subjectids failed in statistic route: '+new Error(err));
        }
        Subject.find({_id:{$in:subjectids},group:group._id},async function(err,subjects){
            if(err) return reject('err: '+new Error(err));
            arr.push({
              group:group,
              subjects:subjects
            })
            return resolve(arr);
        });
      });
    } catch (e) {
      return reject('subjects promise in statistic route failed: '+new Error(e));
    }
  });
}

module.exports = router;
