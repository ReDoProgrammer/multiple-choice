const router = require('express').Router();
const Group = require('../../models/group-model');
const Subject = require('../../models/subject-model');

router.get('/',(req,res)=>{
  let group = req.query.group;
  let subject = req.query.subject;

  res.render('home/index',{layout:'user-layout',user:req.session.user,subject:null});
});

router.get('/view',(req,res)=>{
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
              res.render('home/index',{layout:'user-layout',code:200,msg:'Lấy thông tin môn thành công',group:gr,subject:sbj,user:req.session.user});
            }
          }
        })

      }
    }
  });
});



module.exports = router;
