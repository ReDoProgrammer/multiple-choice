/*
  Route này dùng để xử lý CRUD các bộ môn
  Từ các bộ môn mới có môn.
  Ví dụ: Bộ môn: thi công chức, sẽ có các môn: kiến thức chung, tiếng anh, kiến thức chuyên ngành
*/

const router = require('express').Router();
const Group = require('../../models/group-model');
const Subject = require('../../models/subject-model');
const Question = require('../../models/question-model');
const middleware = require('../../middlewares/middleware');

router.get('/',middleware.isAdmin,(req,res)=>{
  res.render('group/index',{layout:'admin-layout'});
});

router.post('/create',middleware.isAdmin,(req,res)=>{
  let {name,meta,order} = req.body;
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
      console.log('cound group failed: '+new Error(err));
    }else{
      if(count>0){//nếu đã tồn tại
        console.log('count groups failed: '+new Error(err));
      }else{//ngược lại: chưa có trong database
        Group.create({
          name:name,
          meta:meta,
          is_actived:true,
          created_by:req.session.user._id,
          order:order
        },function(err,cl){
          if(err){
            console.log('create group failed: '+new Error(err));
          }else{
            res.send({code:200,msg:'Tạo bộ môn thành công',type:'success'});
          }
        });
      }
    }

  });

});

router.post('/update',middleware.isAdmin,(req,res)=>{
  let {id,order,name,meta} = req.body;
  Group.findOneAndUpdate({_id:id},{
    order:order,
    name:name,
    meta:meta
  },function(err,group){
    if(err){
      console.log('update group failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'Cập nhật lớp học thành công'});
    }
  });
});

router.delete('/delete',middleware.isAdmin,(req,res)=>{
  let id = req.body.id;
  Group.deleteOne({_id:id},function(err){
    if(err){
      console.log('delete group failed: '+new Error(err));
    }else{
      Subject.find({group:id},function(err,subjects){
        if(err){
          console.log('can not find subjects after delete group: '+new Error(err));
        }else{
          // Subject.deleteOne({_id:{$in}})
        }
      })
    }
  })
});

router.get('/list',(req,res)=>{
  let is_actived = req.query.is_actived;
  Group.find({is_actived:is_actived})
  .sort({order:1})
  .exec(function(err,groups){
    if(err){
      console.log('list groups failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'list groups successfully',groups:groups})
    }
  })
});

router.get('/detail',(req,res)=>{

});

module.exports  = router;
