/*
  Route này dùng để xử lý CRUD các bộ môn
  Từ các bộ môn mới có môn.
  Ví dụ: Bộ môn: thi công chức, sẽ có các môn: kiến thức chung, tiếng anh, kiến thức chuyên ngành
*/

const router = require('express').Router();
const Group = require('../../models/group-model');
const middleware = require('../../middlewares/admin-middleware');

router.get('/',middleware.isAdmin,(req,res)=>{
  res.render('group/index',{layout:'admin-layout'});
});

router.post('/create',middleware.isAdmin,(req,res)=>{
  let name = req.body.name;
  let meta = req.body.meta;
  /*
    Tìm kiếm xem tên và thẻ meta của bộ môn đã có trong db chưa ( không tính hoa thường )
    { $regex : new RegExp(name, "i") } không tính hoa thường
    nếu chưa có thì tiến hành thêm
    ngược lại hiện thông báo bộ môn này đã tồn tại
  */
  Group.countDocuments({$or:[
    {name:{ $regex : new RegExp(name, "i") }},
    {meta:{ $regex : new RegExp(meta, "i") }}
  ]},function(err,count){
    if(err){
      res.send({code:500,msg:'Count group failed: '+new Error(err),type:'danger'});
    }
    if(count>0){//nếu đã tồn tại
      res.send({code:101,msg:'Bộ môn này đã tồn tại',type:'warning'});
    }else{//ngược lại: chưa có trong database
      Group.create({
        name:name,
        meta:meta
      },function(err,cl){
        if(err){
          res.send({code:500,msg:'Create class failed: '+new Error(err),type:'danger'});
        }
        res.send({code:200,msg:'Tạo bộ môn thành công',type:'success'});
      });
    }
  })

});

router.post('/update',middleware.isAdmin,(req,res)=>{

});

router.delete('/delete',middleware.isAdmin,(req,res)=>{

});

router.get('/list',(req,res)=>{
  Group.find({},function(err,classes){
    if(err){
      res.send({code:500,msg:'load classes failed: '+new Error(err),type:'danger'});
    }
    res.send({code:200,msg:'load classes successfully',groups:classes});
  });
});

router.get('/detail',(req,res)=>{

});

module.exports  = router;
