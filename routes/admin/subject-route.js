/*
Route này dùng để xử lý CRUD các môn học
Ví dụ: kiến thức chung, kiến thức chuyên ngành, tiếng anh, tin học...
*/

const router = require('express').Router();
const Subject = require('../../models/subject-model');
const middleware = require('../../middlewares/admin-middleware');

router.get('/',middleware.isAdmin,(req,res)=>{
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

router.get('/list-by-group',(req,res)=>{
  let group = req.query.group;

  Subject.find({group:group},function(err,subjects){
    if(err){
      res.send({code:500,type:'danger',msg:'List by group failed: '+new Error(err)});
    }
    res.send({code:200,msg:'List subjects by group successfully',type:'success',subjects:subjects});
  });
});

/*
Khi tiến hành add,update cần kiểm tra xem trong csdl đã tồn tại document này hay chưa
Khi add cần kiểm tra xem đã tồn tại thị không add tiếp nữa.
Khi update cần kiểm tra nội dung update có bị trùng với 1 document nào khác không
*/
router.post('/add',middleware.isAdmin,(req,res)=>{
  let group = req.body.group;
  let name = req.body.name;
  let meta = req.body.meta;

  Subject.countDocuments({
    group:group,
    $or:[
      {name:{ $regex : new RegExp(name, "i") }},
      {meta:{ $regex : new RegExp(meta, "i") }}
    ]
  },function(err,count){
    if(err){
      res.send({code:500,msg:'can not count subject: '+new Error(err),type:'danger'});
    }
    if(count>0){
      res.send({code:101,msg:'Môn này đã tồn tại trong hệ thống',type:'warning'});
    }else{
      Subject.create({name:name,meta:meta,group:group},function(err,subject){
        if(err){
          res.send({code:500,msg:'created subject failed: '+new Error(err),type:'danger'});
        }
        res.send({code:200,msg:'Thêm môn học thành công',type:'success',subject:subject})
      });
    }
  });
});

router.post('/update',middleware.isAdmin,(req,res)=>{

});

router.delete('/delete',middleware.isAdmin,(req,res)=>{

});



module.exports = router;
