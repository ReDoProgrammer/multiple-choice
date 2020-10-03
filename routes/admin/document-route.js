/*
  ROUTE NÀY DÙNG ĐỂ XỬ LÝ CÁC TÀI LIỆU. VÍ DỤ: XDOC,DOC,VIDEO,PDF ...
*/
const router = require('express').Router();
const middleware = require('../../middlewares/middleware');
const Document = require('../../models/document-model');

router.get('/',middleware.isAdmin,(req,res)=>{
    res.render('document/index',{layout:'admin-layout'});
});

router.post('/create',middleware.isAdmin,(req,res)=>{
  let {subject,doctype,name,link,description} = req.body;
  Document.create({
    subject:subject,
    doctype:doctype,
    name:name,
    link,
    description:description
  },function(err,doc){
    if(err){
      console.log('create new document failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'Tạo mới tài liệu thành công'});
    }
  });
});

router.post('/update',middleware.isAdmin,(req,res)=>{

});

router.delete('/delete',middleware.isAdmin,(req,res)=>{

});

router.get('/list',(req,res)=>{
  let {subject,doctype,search} = req.query;
  Document.find({})
  .populate('doctype','icon icon_class')
  .populate([{ path: 'subject', populate: { path: 'group' }}])
  .exec(function(err,documents){
    if(err){
      console.log('list document failed: '+new Error(err));
    }else{
      res.send({code:200,documents:documents,msg:'load documents successfully'});
    }
  });
});

module.exports = router;
