const router = require('express').Router();
const Group = require('../../models/group-model');
const Subject = require('../../models/subject-model');

router.get('/',(req,res)=>{
  let group = req.query.group;
  let subject = req.query.subject;
  res.render('home/index',{layout:'user-layout',user:req.session.user,group:null,subject:null});
});

router.get('/view',(req,res)=>{
  let group = req.query.group;
  let subject = req.query.subject;
  Group.findOne({meta:group},function(err,gr){
    if(err){
      console.log('home view error when find group: '+new Error(err));
    }else{
      if(!gr){
        res.render('404',{layout:'404',msg:group+' không tồn tại'});
      }else{
        Subject.findOne({meta:subject},function(err,sb){
          if(err){
            console.log('find subject in home->view failed: '+new Error(err));
          }else{
            if(!sb){
              res.render('404',{layout:'404',msg:'môn '+subject+' không tồn tại'});
            }else{
              res.render('home/index',{layout:'user-layout',user:req.session.user,group:gr,subject:sb});
            }
          }
        })
      }
    }
  })
});



module.exports = router;
