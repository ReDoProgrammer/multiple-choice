const Legal = require('../models/legal-doc-model');

const router = require('express').Router();

const isAdmin = function(req,res,next){
  if(req.session.user && req.session.user.is_admin){
    next();
  }else{
    res.redirect('/admin/logout');
  }
}


//show index
router.get('/',isAdmin,(req,res)=>{
  res.render('legal/index');
});

//chức năng thêm mới loại văn bản
router.post('/add',isAdmin,(req,res)=>{
  let name = req.body.name;
  let remark = req.body.remark;
  console.log(name,remark);
  Legal.create({name:name},function(err,t){
    if(err){
      res.send({msg:'Thêm loại văn bản luật thất bại', class:'danger'});
      console.log('Lỗi thêm mới loại văn bản: '+err);
    }
    res.send({msg:'Thêm mới loại văn bản thành công!'});
  });
});

router.post('/update',isAdmin,(req,res)=>{
  let id = req.body.id;
  let name = req.body.name;
  let remark = req.body.remark;

  Legal.findOneAndUpdate({_id:id},{
      name:name,
      remark:remark
    },
    { //options
      returnNewDocument: true,
      new: true,
      strict: false
    }
    ,function(err,t){
    if(err){
      res.send({msg:'Cập nhật loại văn bản luật thất bại', class:'danger'});
      console.log('Lỗi cập nhật loại văn bản: '+err);
    }
    console.log('sau khi update: ',t);
    res.send({msg:'Cập nhật loại văn bản thành công!',legal:t});
  });
});

//hàm trả về danh sách các loại văn bản pháp luật
//vì hàm này được hiển thị ở phía client nên không được thêm middleware vào
router.get('/list',(req,res)=>{
  Legal.find({},function(err,lst){
    if(err){
      console.log('Lỗi lấy danh sách các loại văn bản: ',err);
    }
    res.send({ds:lst});
  });
});

//hàm trả về một loại văn bản pháp luật dựa vào id
router.get('/detail',isAdmin,(req,res)=>{
  let id = req.query.id;
  Legal.findById(id,function(err,t){
    if(err){
      console.log('khong tim thay loai van ban dua vao id: ',err);
    }
    res.send({t:t});
  })
});
module.exports = router;
