const router = require('express').Router();
const Subject = require('../../models/subject-model');
const middeware = require('../../middlewares/admin-middleware');

router.get('/',middeware.isAdmin,(req,res)=>{
  res.render('subject/index',{layout:'admin-layout'});
});

router.get('/list',(req,res)=>{
  Subject.find({})
  .populate('group')
  .sort({group:1})
  .exec(function(err,subjects){
    if(err){
      res.send({code:500,msg:'load subjects failed: '+new Error(err),type:'danger'});
    }
    res.send({code:200,msg:'load subjects successfully',subjects:subjects,type:'success'});
  });
});

router.post('/add',middeware.isAdmin,(req,res)=>{
  let group = req.body.group;
  let name = req.body.name;
  let meta = req.body.meta;
  

  Subject.create({name:name,meta:meta,group:group},function(err,subject){
    if(err){
      res.send({code:500,msg:'created subject failed: '+new Error(err),type:'danger'});
    }
    res.send({code:200,msg:'Thêm môn học thành công',type:'success',subject:subject})
  });
});

router.post('/update',middeware.isAdmin,(req,res)=>{

});

router.delete('/delete',middeware.isAdmin,(req,res)=>{

});



module.exports = router;
