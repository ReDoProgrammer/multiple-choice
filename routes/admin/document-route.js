/*
  ROUTE NÀY DÙNG ĐỂ XỬ LÝ CÁC TÀI LIỆU. VÍ DỤ: XDOC,DOC,VIDEO,PDF ...
*/
const router = require('express').Router();
const middleware = require('../../middlewares/middleware');
const Group = require('../../models/group-model');
const Subject = require('../../models/subject-model');
const DocType = require('../../models/doc-type-model');
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
      //push child item into parents
      DocType.findOneAndUpdate({_id:doctype},{$push:{documents:doc}},function(err,dt){
        if(err){
          console.log('push document into parents failed: '+new Error(err));
        }else{
          res.send({code:200,msg:'Tạo mới tài liệu thành công'});
        }
      });
    }
  });
});

router.post('/update',middleware.isAdmin,(req,res)=>{

});

router.delete('/delete',middleware.isAdmin,(req,res)=>{

});

router.get('/list',(req,res)=>{
  let {subject,doctype,search} = req.query;
  Document.find({
    subject:subject,
    doctype:doctype,
    name: { $regex: search, $options: "i" },
  })
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

router.get('/list-by-subject',(req,res)=>{
  let {subjectId} = req.query;
  Document.find({subject:subjectId})
  .populate('doctype','icon icon_class')
  .exec(function(err,documents){
    if(err){
      console.log('find document in list document by subject failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'list document by subject successfully',documents:documents});
    }
  });

});

module.exports = router;
