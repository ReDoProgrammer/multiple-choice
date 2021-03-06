const router = require("express").Router();
const User = require("../../models/user-model");
const Job = require("../../models/job-model");
const Comment = require("../../models/comment-model");
const Group = require("../../models/group-model");
const Subject = require("../../models/subject-model");
const Question = require("../../models/question-model");
const Statistic = require("../../models/statistic-model");
const DocType = require("../../models/doc-type-model");
const Document = require("../../models/document-model");
const Config = require("../../models/config-model");
const common = require("../../common/common");
const middleware = require("../../middlewares/middleware");
var session = require("express-session");

router.get("/", middleware.isAdmin, (req, res) => {
  res.render("admin/home", { layout: "admin-layout" });
});

router.get("/init", (req, res) => {
  //Khởi tạo nghề nghiệp
  Job.countDocuments({}, function (err, c) {
    if (err) {
      console.log("count job failed: " + new Error(err));
    } else {
      if (c == 0) {
        const jobs = [
          { name: "Sinh viên" },
          { name: "Công nhân" },
          { name: "Bác sĩ" },
          { name: "Giáo viên" },
          { name: "Tài xế" },
          { name: "Doanh nhân" },
          { name: "Nông dân" },
          { name: "Khác" },
        ];
        Job.insertMany(jobs, function (err, rs) {
          if (err) {
            console.log("init jobs failed: " + new Error(err));
          } else {
            console.log("init jobs successfully");
          }
        });
      }
    }
  });

  User.deleteMany({}, function (err) {
    if (err) {
      console.log("can not delete all users: " + new Error(err));
    } else {
      console.log("delete all users successfully");
    }
  });
  let redo = new User({
      username: "redo",
      password: "ReDo1@vn",
      fullname: "Nguyễn Hữu Trường",
      is_admin: true,
      is_censor: true,
      member_code: common.MemberCode(),
      avatar: "/user/images/photos/loggeduser.png",
    });
    redo.save(function(err) {
      if (err) throw err;
      console.log('ok');
    });

    let redo1 = new User({
      username: "redo1",
      password: "ReDo1@vn",
      fullname: "Nguyễn Hữu Trường1",
      is_admin: false,
      is_censor: true,
      member_code: common.MemberCode(),
      avatar: "/user/images/photos/loggeduser.png",
    });
    redo1.save(function(err) {
      if (err) throw err;
      console.log('ok');
    });

    let redo2=new User({
      username: "redo2",
      password: "ReDo1@vn",
      fullname: "Nguyễn Hữu Trường2",
      is_admin: false,
      is_censor: true,
      member_code: common.MemberCode(),
      avatar: "/user/images/photos/loggeduser.png",
    });
    redo2.save(function(err) {
      if (err) throw err;
      console.log('ok');
    });


    
  Config.countDocuments({}, function (err, count) {
    if (err) {
      console.log("count config failed: " + new Error(err));
    } else {
      if (count == 0) {
        let configs = [
          {
            key: "page-size",
            value: "20",
            description: "Số dòng trên mỗi trang",
          },
          {
            key: "exam-time",
            value: "45",
            description: "Thời gian làm bài kiểm tra",
          },
          {
            key: "questions-size",
            value: "20",
            description: "Số câu hỏi tương ứng với mỗi bài kiểm tra",
          },
          {
            key: "comments-size",
            value: "10",
            description: "Số comment trên mỗi trang",
          },
        ];
        Config.insertMany(configs, function (err, cf) {
          if (err) {
            console.log("init config failed: " + new Error(err));
          } else {
            console.log("init config successfully");
          }
        });
      }
    }
  });
});

/*
  DROP ZONE
*/
router.get("/drop-group", middleware.isAdmin, (req, res) => {
  Group.collection.drop();
  console.log("drop groups successfully");
});
router.get("/drop-subject", middleware.isAdmin, (req, res) => {
  Subject.collection.drop();
  console.log("drop subjects successfully");
});
router.get("/drop-question", middleware.isAdmin, (req, res) => {
  Question.collection.drop();
  console.log("drop questions successfully");
});
router.get("/drop-statistic", middleware.isAdmin, (req, res) => {
  Statistic.collection.drop();
  console.log("drop statistics successfully");
});
router.get("/drop-user", middleware.isAdmin, (req, res) => {
  User.collection.drop();
  console.log("drop user successfully");
});
router.get("/drop-comment", middleware.isAdmin, (req, res) => {
  Comment.collection.drop();
  console.log("drop comments successfully");
});
router.get("/drop-document-type", middleware.isAdmin, (req, res) => {
  DocType.collection.drop();
  console.log("drop document type successfully");
});
router.get("/drop-document", middleware.isAdmin, (req, res) => {
  Document.collection.drop();
  console.log("drop documents successfully");
});

router.get("/drop-job", middleware.isAdmin, (req, res) => {
  Job.collection.drop();
  console.log("drop jobs successfully");
});

router.get("/login", (req, res) => {
  if (req.session.user && req.session.user.is_admin) {
    res.redirect("/admin/");
  } else {
    res.render("admin/login", { layout: "admin/login" });
  }
});

router.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      console.log("error login: ", new Error(err));
    }
    if (user) {
      // kiểm tra mật khẩu khớp hay chưa
      user.ComparePassword(password, function (err, isMatch) {
        if (err) {
          console.log(new Error("lỗi đăng nhập admin:", err));
          return;
        }
        // //nếu khớp mật khẩu
        if (isMatch) {
          //kiểm tra có phải admin k
          if (user.is_admin) {
            //set session khi đăng nhập thành công
            req.session.user = user;
            res.send({
              msg: "Bạn đăng nhập quản trị thành công",
              type: "success",
              user: user,
              url: "/admin/",
            });
          } else {
            res.render("admin/login", {
              layout: "admin/login",
              msg: "Bạn không có quyền truy cập module này",
            });
          }
        } else {
          //nếu không khớp mật khẩu
          res.send({
            msg: "Mật khẩu không chính xác. Vui lòng kiểm tra lại",
            type: "warning",
          });
        }
      });
    } else {
      res.send({
        msg: "Tài khoản không đúng. Vui lòng kiểm tra lại",
        type: "warning",
      });
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/admin/login");
  });
});

module.exports = router;
