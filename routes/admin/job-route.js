/*
  Route này dùng để xử lý CRUD nghề nghiệp
*/

const router = require('express').Router();
const Job = require('../../models/job-model');
const middleware = require('../../middlewares/admin-middleware');

router.get('/',middleware.isAdmin,(req,res)=>{
  res.render('job/index',{layout:'admin-layout'});
});

router.post('/create',middleware.isAdmin,(req,res)=>{


});

router.post('/update',middleware.isAdmin,(req,res)=>{

});

router.delete('/delete',middleware.isAdmin,(req,res)=>{

});

router.get('/list',(req,res)=>{
  Job.find({},function(err,jobs){
    if(err){
      console.log('list jobs failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'load jobs successfully',jobs:jobs});
    }
  })
});

router.get('/detail',(req,res)=>{

});

module.exports  = router;
