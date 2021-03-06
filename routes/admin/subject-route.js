/*
Route này dùng để xử lý CRUD các môn học
Ví dụ: kiến thức chung, kiến thức chuyên ngành, tiếng anh, tin học...
*/

const router = require('express').Router();
const Group = require('../../models/group-model');
const Subject = require('../../models/subject-model');
const Question = require('../../models/question-model');
const middleware = require('../../middlewares/middleware');

router.get('/',middleware.isAdmin,(req,res)=>{
  res.render('subject/index',{layout:'admin-layout'});
});

router.get('/list',(req,res)=>{
  let is_actived = req.query.is_actived;
  Subject.find({is_actived:is_actived})
  .populate('group')
  .sort({group:1})
  .sort({order:1})
  .exec(function(err,subjects){
    if(err){
      console.log('list subject failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'load subjects successfully',subjects:subjects,type:'success'});
    }

  });
});

router.get('/list-all',(req,res)=>{
  Subject.find({is_actived:true},function(err,subjects){
    if(err){
      console.log('list all subjects failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'list all subjects successsfully',subjects:subjects});
    }
  });
});

router.get('/list-by-group',(req,res)=>{
  let group = req.query.group;
  let is_actived = req.query.is_actived;
  Subject.find({group:group,is_actived:is_actived},function(err,subjects){
    if(err){
      console.log('find subject by group failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'List subjects by group successfully',type:'success',subjects:subjects});
    }
  });
});

/*
Khi tiến hành add,update cần kiểm tra xem trong csdl đã tồn tại document này hay chưa
Khi add cần kiểm tra xem đã tồn tại thị không add tiếp nữa.
Khi update cần kiểm tra nội dung update có bị trùng với 1 document nào khác không
*/
router.post('/add',middleware.isAdmin,(req,res)=>{
  let {group,name,meta,description,order} = req.body;
  Subject.countDocuments({
    group:group,
    $or:[
      {name:{ $regex : new RegExp(name, "i") }},
      {meta:{ $regex : new RegExp(meta, "i") }}
    ]
  },function(err,count){
    if(err){
      console.log('add subject failed: '+new Error(err));
    }else{
      if(count>0){
        res.send({code:101,msg:'Môn này đã tồn tại trong hệ thống',type:'warning'});
      }else{
        Subject.create({
          name:name,
          meta:meta,
          group:group,
          description:description,
          created_by:req.session.user._id,
          is_actived:true,
          order:order
        },function(err,subject){
          if(err){
            console.log('create subject failed: '+new Error(err));
          }else{
            Group.findOneAndUpdate({_id:group},{$push:{subjects:subject}},function(err,gp){
              if(err){
                console.log('push subject into it\'s parent failed: '+new Error(err));
              }else{
                res.send({code:200,msg:'Thêm môn học thành công',type:'success',subject:subject});
              }
            });
          }
        });
      }
    }
  });
});

router.post('/update',middleware.isAdmin,(req,res)=>{
  let {id,group,name,meta,description,order} = req.body;
  Subject.findOneAndUpdate({_id:id},{
    group:group,
    name:name,
    meta:meta,
    description:description,
    order:order
  },(err,subject)=>{
    if(err){
      console.log('update subject failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'Cập nhật môn học thành công'});
    }
  });
});

router.delete('/delete',middleware.isAdmin,(req,res)=>{
  let id = req.body.id;
  Subject.deleteOne({_id:id},function(err){
    if(err){
      console.log('delete subject failed: '+new Error(err));
    }else{
      Question.deleteMany({subject:id},function(err){
        if(err){
          console.log('delete questions after subject deleted failed: '+new Error(err));
        }else{
          res.send({code:200,msg:'Xóa môn học và các câu hỏi liên quan thành công!'});
        }
      });
    }
  })
});

router.get('/detail',middleware.isAdmin,(req,res)=>{
  let id = req.query.id;
  Subject.findById(id,function(err,subject){
    if(err){
      console.log('find subject by id failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'find question by id successfully',subject:subject});
    }
  });
});

module.exports = router;
