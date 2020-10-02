/*
  ROUTE NÀY DÙNG ĐỂ XỬ LÝ CÁC LOẠI TÀI LIỆU. VÍ DỤ: XDOC,DOC,VIDEO,PDF ...
*/

const router = require('express').Router();
const middleware = require('../../middlewares/middleware');
const DocumentType = require('../../models/doc-type-model');

router.get('/',middleware.isAdmin,(req,res)=>{
  res.render('doctype/index',{layout:'admin-layout'});
});

router.post('/create',middleware.isAdmin,(req,res)=>{
  let {name,meta,icon,icon_class} = req.body;
  DocumentType.countDocuments({$or:[
    {name:name},
    {meta:meta}
  ]},function(err,count){
    if(err){
      console.log('find document type failed: '+new Error(err));
    }else{
      if(count>0){
        res.send({code:401,msg:'Loại tài liệu này đã tồn tại'});
      }else{
        DocumentType.create({
          name:name,
          meta:meta,
          icon:icon,
          icon_class:icon_class
        },function(err,dt){
          if(err){
            console.log('create document type failed: '+new Error(err));
          }else{
            res.send({code:200,msg:'Tạo loại tài liệu thành công'});
          }
        });
      }
    }
  });

});

router.post('/update',middleware.isAdmin,(req,res)=>{

});

router.delete('/delete',middleware.isAdmin,(req,res)=>{

});

router.get('/list',(req,res)=>{
  DocumentType.find({},function(err,dt){
    if(err){
      console.log('list document types failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'load document types successfully',document_types:dt});
    }
  });
});

module.exports = router;
