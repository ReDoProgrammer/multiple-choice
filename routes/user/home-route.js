const router = require('express').Router();
const Group = require('../../models/group-model');
const Subject = require('../../models/subject-model');
const Question = require('../../models/question-model');

router.get('/',(req,res)=>{
  let group = req.query.group;
  let subject = req.query.subject;
  res.render('home/index',{layout:'user-layout',user:req.session.user});
  // res.render('bao-tri',{layout:'bao-tri'});
});

router.get('/tim-kiem',(req,res)=>{
  let {group,subject,key} = req.query;
  if(group){//nếu biến group có giá trị => tìm kiếm group
    Group.findOne({meta:group},function(err,gr){
      if(err){//nếu có lỗi trong quá trình tìm kiếm
        console.log('find group in home/view failed: '+new Error(err));
      }else{
        if(!gr){//nếu không tìm thấy group tương ứng
          res.render('404',{layout:'404',msg:'Không tồn tại lớp: '+group});
        }else{
          if(subject){//nếu có giá trị của meta subject
            Subject.findOne({group:gr._id,meta:subject},function(err,sbj){
              if(err){//nếu có lỗi trong tìm kiếm subject
                console.log('can not find subject '+subject + 'in group: '+gr.name+'. Error: '+new Error(err));
              }else{//nếu tìm kiếm thành công
                if(!sbj){//nếu subject trả về không có giá trị = null?
                  res.render('404',{layout:'404',msg:'Không tồn tại môn:'+subject+' của group: '+gr.name});
                }else{//nếu tìm thấy
                  res.render('home/search',{layout:'user-layout',group:gr,subject:sbj,key:key});
                }
              }
            });
          }else{//nếu không có giá trị meta subject => trả về những subject thuộc group đã tìm thấy
            Subject.find({group:gr._id},function(err,subjects){
              if(err){
                console.log('can not find any subject belongs to '+gr.name+'. Error: '+new Error(err));
              }else{
                res.render('home/search',{layout:'user-layout',group:gr,subjects:subjects,key:key});
              }
            });
          }
        }
      }
    });
  }else{
    res.render('home/search',{layout:'user-layout',key:key});
  }
});
router.get('/view',(req,res)=>{
  let {group,subject} = req.query;
  if(group){//nếu biến group có giá trị => tìm kiếm group
    Group.findOne({meta:group},function(err,gr){
      if(err){//nếu có lỗi trong quá trình tìm kiếm
        console.log('find group in home/view failed: '+new Error(err));
      }else{
        if(!gr){//nếu không tìm thấy group tương ứng
          res.render('404',{layout:'404',msg:'Không tồn tại lớp: '+group});
        }else{
          if(subject){//nếu có giá trị của meta subject
            Subject.findOne({group:gr._id,meta:subject},function(err,sbj){
              if(err){//nếu có lỗi trong tìm kiếm subject
                console.log('can not find subject '+subject + 'in group: '+gr.name+'. Error: '+new Error(err));
              }else{//nếu tìm kiếm thành công
                if(!sbj){//nếu subject trả về không có giá trị = null?
                  res.render('404',{layout:'404',msg:'Không tồn tại môn:'+subject+' của group: '+gr.name});
                }else{//nếu tìm thấy
                  res.render('home/index',{layout:'user-layout',group:gr,subject:sbj});
                }
              }
            });
          }else{//nếu không có giá trị meta subject => trả về những subject thuộc group đã tìm thấy
            Subject.find({group:gr._id},function(err,subjects){
              if(err){
                console.log('can not find any subject belongs to '+gr.name+'. Error: '+new Error(err));
              }else{
                res.render('home/index',{layout:'user-layout',group:gr,subjects:subjects});
              }
            });
          }
        }
      }
    });
  }
});

router.get('/detail',(req,res)=>{
  let {group,subject} = req.query;
  if(group){//nếu biến group có giá trị => tìm kiếm group
    Group.findOne({meta:group},function(err,gr){
      if(err){//nếu có lỗi trong quá trình tìm kiếm
        console.log('find group in home/view failed: '+new Error(err));
      }else{
        if(!gr){//nếu không tìm thấy group tương ứng
          res.render('404',{layout:'404',msg:'Không tồn tại lớp: '+group});
        }else{
          if(subject){//nếu có giá trị của meta subject
            Subject.findOne({group:gr._id,meta:subject},function(err,sbj){
              if(err){//nếu có lỗi trong tìm kiếm subject
                console.log('can not find subject '+subject + 'in group: '+gr.name+'. Error: '+new Error(err));
              }else{//nếu tìm kiếm thành công
                if(!sbj){//nếu subject trả về không có giá trị = null?
                  res.render('404',{layout:'404',msg:'Không tồn tại môn:'+subject+' của group: '+gr.name});
                }else{//nếu tìm thấy
                  res.send({code:200,group:gr,subject:sbj});
                }
              }
            });
          }else{//nếu không có giá trị meta subject => trả về những subject thuộc group đã tìm thấy
            Subject.find({group:gr._id},function(err,subjects){
              if(err){
                console.log('can not find any subject belongs to '+gr.name+'. Error: '+new Error(err));
              }else{
                res.send({code:200,group:gr,subjects:subjects});
              }
            });
          }
        }
      }
    });
  }
});



module.exports = router;
