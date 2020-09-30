const router = require('express').Router();
const Group = require('../../models/group-model');
const middeware = require('../../middlewares/admin-middleware');

router.get('/',middeware.isAdmin,(req,res)=>{
  res.render('group/index',{layout:'admin-layout'});
});

router.post('/create',middeware.isAdmin,(req,res)=>{
  let name = req.body.name;
  let meta = req.body.meta;
  Group.countDocuments({$or:[
    {name:{ $regex : new RegExp(name, "i") }},
    {meta:{ $regex : new RegExp(meta, "i") }}    
  ]},function(err,gr){
    if(err){
      console.log('error when find group: '+new Error(err));
    }
    if(gr){
      console.log('exist',gr);
    }else{
      console.log(0);
    }
  })
  // Group.create({
  //   name:name,
  //   meta:meta
  // },function(err,cl){
  //   if(err){
  //     res.send({code:500,msg:'Create class failed: '+new Error(err),type:'danger'});
  //   }
  //   res.send({code:200,msg:'created class successfully',type:'success'});
  // });
});

router.post('/update',middeware.isAdmin,(req,res)=>{

});

router.delete('/delete',middeware.isAdmin,(req,res)=>{

});

router.get('/list',(req,res)=>{
  Group.find({},function(err,classes){
    if(err){
      res.send({code:500,msg:'load classes failed: '+new Error(err),type:'danger'});
    }
    res.send({code:200,msg:'load classes successfully',classes:classes});
  });
});

router.get('/detail',(req,res)=>{

});

module.exports  = router;
