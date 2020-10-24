const router = require("express").Router();
const LivedRoom = require("../../models/lived-room-model");
const LivedExam = require("../../models/lived-exam-model");
const Question = require("../../models/question-model");
const middleware = require("../../middlewares/middleware");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  res.render("live/index", { layout: "user-layout" });
});

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

router.get("/destroy-all-rooms", middleware.isAdmin, (req, res) => {
  LivedRoom.deleteMany({}, function (err) {
    if (err) {
      console.log("destroy all rooms failed: " + new Error(err));
    } else {
      LivedRoom.collection.drop();
      res.send({ code: 200, msg: "destroy all rooms successfully" });
    }
  });
});

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

router.post("/generate-exam", middleware.isLoggedIn, (req, res) => {
  let { room, subject } = req.body;
  LivedRoom.findById(room, function (err, r) {//tìm ra phòng để lấy thông tin số câu hỏi, thời gian thi
    if (err) {
      console.log("find room failed: " + new Error(err));
    } else {
      Question.aggregate(
        [
          {
            $match: {
              subject: mongoose.Types.ObjectId(subject),
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

router.get("/list", (req, res) => {
  LivedRoom.find({ status: { $in: [-1, 0] } })
    .populate("subject", "name")
    .exec(function (err, rooms) {
      if (err) {
        console.log("list rooms failed: " + new Error(err));
      } else {
        res.send({ code: 200, msg: "load rooms successfully", rooms: rooms });
      }
    });
});

router.post('/finish',middleware.isLoggedIn,(req,res)=>{
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
