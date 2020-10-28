const router = require("express").Router();
const LivedRoom = require("../../models/lived-room-model");
const LivedExam = require("../../models/lived-exam-model");
const Question = require("../../models/question-model");
const middleware = require("../../middlewares/middleware");
const mongoose = require("mongoose");
const { DateTime } = require('luxon');

//router trả về trang chủ live
router.get("/", (req, res) => {
  res.render("live/index", { layout: "user-layout",group:'Thi trực tuyến'});
});

//kiểm tra trạng thái đăng nhập thành viên trả về session user
router.get("/check-login", (req, res) => {
  if (req.session.user) {
    res.send({
      code: 200,
      msg: "user is already logged in",
      user: req.session.user,
    });
  } else {
    res.send({ code: 401, msg: "user is not already login" });
  }
});

//hàm kiểm tra quyền admin
router.get("/permission", (req, res) => {
  if (req.session.user && req.session.user.is_admin) {
    res.send({ code: 200, msg: "you can create a live exam room" });
  } else {
    res.send({
      code: 401,
      msg: "Rất tiếc! Tính năng này hiện tại chỉ cho phép admin thao tác.",
    });
  }
});

//xóa toàn bộ phòng thi và kết quả làm bài của user
router.get("/destroy-all-rooms", middleware.isAdmin, (req, res) => {
  LivedRoom.deleteMany({}, function (err) {
    if (err) {
      console.log("destroy all rooms failed: " + new Error(err));
    } else {
      LivedRoom.collection.drop();
      LivedExam.collection.drop();
      res.send({ code: 200, msg: "destroy all rooms successfully and their exams" });
    }
  });
});

//hàm tạo phòng thi mới
router.post("/create", middleware.isLoggedIn, (req, res) => {
  if (req.session.user.is_admin) {
    let { subject, number_of_question, duration, started_time } = req.body;
    LivedRoom.create(
      {
        subject: subject,
        duration: duration,
        number_of_question: number_of_question,
        created_by: req.session.user._id,
        started_time: new Date(started_time),
      },
      function (err, room) {
        if (err) {
          console.log("create new live room failed: " + new Error(err));
        } else {
          res.send({
            code: 200,
            msg: "Tạo phòng thi trực tuyến thành công",
            room: room,
          });
        }
      }
    );
  } else {
    res.send({
      code: 401,
      msg: "Tính năng này hiện tại chỉ admin mới có quyền thao tác",
    });
  }
});


router.post('/register',(req,res)=>{
  if(req.session.user){
    let room_id = req.body.room_id;
    LivedRoom.findById(room_id,function(err,room){
      if(err){
        console.log('appy room failed. can not find room: '+new Error(err));
      }else{
        let chk = room.registers.find(x=>x == req.session.user._id);
        if(!chk){
          LivedRoom.updateOne({_id:room_id},{
            $push:{registers:req.session.user._id}
          },function(err,register){
            if(err){
              console.log('register to room failed: '+new Error(err));
            }else{
              res.send({code:200,msg:'Đăng ký dự thi thành công.\nVui lòng online đúng giờ để tham gia thi.\nGood luck ^_^!'});
            }
          });          
        }else{
          res.send({code:400,msg:'Danh sách dự thi đã tồn tại tài khoản của bạn'});
        }
      }
    });
  }else{
    res.send({code:401,msg:'Vui lòng đăng nhập thành viên để đăng ký dự thi'});
  }
});

//hàm trả về danh sách câu hỏi được lấy random dựa vào thông tin của room
router.post("/generate-exam", middleware.isLoggedIn, (req, res) => {
  let { room} = req.body;
  LivedRoom.findById(room, function (err, r) {//tìm ra phòng để lấy thông tin số câu hỏi, thời gian thi
    if (err) {
      console.log("find room failed: " + new Error(err));
    } else {
      Question.aggregate(
        [
          {
            $match: {
              subject: mongoose.Types.ObjectId(r.subject),
              is_actived: true,
            },
          },
          { $sample: { size: r.number_of_question } },
        ],
        function (err, questions) {
          if (err) {
            console.log("get random questions failed: " + new Error(err));
          } else {
            LivedRoom.findOneAndUpdate(
              { _id: room },
              {
                $push: { questions: questions },
                status:0//khi tạo câu hỏi -> chuyển trạng thái room từ -1 -> 0 : đang thi
              },
              {
                safe: true,
                upsert: true,
                new: true,
              },
              function (err, result) {
                if (err) {
                  console.log(
                    "push questions into room failed: " + new Error(err)
                  );
                } else {
                  res.send({
                    code: 200,
                    type: "success",
                    msg: "get random questions successfully",
                    questions: questions,
                    duration:result.duration
                  });
                }
              }
            );
          }
        }
      );
    }
  });
});

//hàm trả về danh sách phòng có trạng thái là -1: chưa thi hoặc 0: đang thi
router.get("/list", (req, res) => { 

  LivedRoom.find({status: { $in: [-1, 0] }})
  // .where('started_time').gt(new Date().toLocaleString('en-US', {
  //   timeZone: 'Asia/Ho_chi_minh'
  // }))//chỉ lấy những room có giờ bắt đầu lớn hơn hiện tại
    .populate("subject", "name")
    .exec(function (err, rooms) {
      if (err) {
        console.log("list rooms failed: " + new Error(err));
      } else {
        res.send({ code: 200, msg: "load rooms successfully", rooms: rooms });
      }
    });
});



//hàm lưu kết quả bài thi của user
router.post('/push-result',middleware.isLoggedIn,(req,res)=>{
  let result = req.body.result;
  let room = req.body.room;
  LivedExam.create({
    room:room,
    user:req.session.user._id,
    result:result
  },function(err,exam){
    if(err){
      console.log('save lived exam result failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'Lưu kết quả bài kiểm thi thành công',exam:exam});
    }
  })
});

router.get('/apply',middleware.isLoggedIn,(req,res)=>{
  let room = req.query.room;
  LivedRoom.findById(room)  
  .populate('subject','_id name')
  .exec(function(err,room){
    if(err){
      console.log('can not find room: '+new Error(err));
    }else{
      if(room.status == 1){//đã thi xong
        res.redirect('/live');
      }else{
        res.render('live/room',{layout:'user-layout',room:room});
      }
     
    }   
  })
 
});
//hàm set trạng thái của phòng thi khi kết thúc thi
router.post('/finish',middleware.isLoggedIn,(req,res)=>{
  let room = req.body.room;
  LivedRoom.findByIdAndUpdate({_id:room},{
    status:1// đã thi xong
  },function(err,room){
    if(err){
      console.log('finish room failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'finish room successfully'});
    }
  });
});

/*
  - sau khi bắt đầu bài thi
  - nếu tất cả user đều thoát khỏi phòng thi
  - thì xóa phòng thi đó
*/
router.delete('/delete',(req,res)=>{
  let room = req.body.room;
  LivedRoom.deleteOne({_id:room},function(err){
    if(err){
      console.log('delete room failed: '+new Error(err));
    }else{
      res.send({code:200,msg:'delete room successfully'});
    }
  });
});

module.exports = router;
