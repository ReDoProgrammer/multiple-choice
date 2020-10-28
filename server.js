const express = require("express");
const app = express();
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose"); //database
const config = require("./configs/config");
const bodyParser = require("body-parser"); //body parser dùng để lấy dữ liệu từ form
const passport = require("passport");

const server = require("http").Server(app);
const io = require("socket.io")(server);

//những hàm liên quan tới khách vãng lai = không phải thành viên
const {
  visitorConnect,
  vistorDisconnect,
  vistorsCount,
} = require("./utils/visitors");

const {
  pushMember,
  getMember,
  joinRoom,
  getRoom,
  membersInRoom,
  membersNinRoom,
  onExam,
  finishExam,
  pushResult,
  checkPushResultAll,
  sortRank,
  finishRoom,
  removeMember,
  leaveRoom,
  allMembers
} = require("./utils/members");

// những hàm liên quan tới đề thi lưu trữ trên RAM server
const { pushExam, getExam, removeExam } = require("./utils/exams");

//phần routes của admin
const adminRoutes = require("./routes/admin/admin-route");
const configRoutes = require("./routes/admin/config-route");
const documentRoutes = require("./routes/admin/document-route");
const docTypeRoutes = require("./routes/admin/doctype-route");
const groupRoutes = require("./routes/admin/group-route");
const jobRoutes = require("./routes/admin/job-route");
const memberRoutes = require("./routes/admin/member-route");
const newsRoutes = require("./routes/admin/news-route");
const questionRoutes = require("./routes/admin/question-route");
const subjectRoutes = require("./routes/admin/subject-route");

//phần route của user hoặc guest
const censorRoutes = require("./routes/user/censor-route");
const commentRoutes = require("./routes/user/comment-route");
const contributeQuestionRoutes = require("./routes/user/contribute-question-route");
const examRoutes = require("./routes/user/exam-route");
const facebookRoutes = require("./routes/user/facebook-route");
const googleRoutes = require("./routes/user/google-route");
const homeRoutes = require("./routes/user/home-route");
const liveRoutes = require("./routes/user/lived-exam-route");
const replytRoutes = require("./routes/user/reply-route");
const socialAuthRoutes = require("./routes/user/social-auth-route");
const statisticRoutes = require("./routes/user/statistic-route");
const userRoutes = require("./routes/user/user-route");

app.set("view engine", "ejs"); //set view engine cho nodejs
app.set("views", "./views"); //set thư mục view cho project
app.use(express.static("./public")); //set đường dẫn tới thư mục public gồm css,js,bootstrap...
app.use(expressLayouts); //set layout

//cấu hình session
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: config.secretKey,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: config.fb_api.clientID,
      clientSecret: config.fb_api.clientSecret,
      callbackURL: config.fb_api.callbackURL,
      profileFields: config.fb_api.profileFields,
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
  ROUTE
*/
//phần routes admin
app.use("/admin", adminRoutes);
app.use("/admin/config", configRoutes);
app.use("/admin/document", documentRoutes);
app.use("/admin/document-type", docTypeRoutes);
app.use("/admin/group", groupRoutes);
app.use("/admin/job", jobRoutes);
app.use("/admin/member", memberRoutes);
app.use("/admin/news", newsRoutes);
app.use("/admin/question", questionRoutes);
app.use("/admin/subject", subjectRoutes);

//phần route user

app.use("/censor", censorRoutes); //route kiểm duyệt câu hỏi
app.use("/comment", commentRoutes); //route bình luận
app.use("/contribute-question", contributeQuestionRoutes); //đóng góp câu hỏi
app.use("/lam-bai-thi", examRoutes); //route làm bài thi
app.use("/", facebookRoutes); //route facebook
app.use("/", googleRoutes); //route google
app.use("/", homeRoutes); //route trang chủ
app.use("/live", liveRoutes); //route làm bài trực tuyến
app.use("/reply", replytRoutes); //route trả lời bình luận
app.use("/auth", socialAuthRoutes); //route đăng nhập bằng api mạng xã hội
app.use("/statistic", statisticRoutes); //route thống kê kết quả làm bài
app.use("/user", userRoutes); //route thành viên

mongoose.connect(
  config.mongodb.mongodb,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    console.log("connect database successfully");
  }
);
server.listen(8080, () => {
  console.log("server is running ...");
});

io.on("connection", function (socket) {
  visitorConnect(socket.id);
  io.sockets.emit("counter", { count: vistorsCount() });

  socket.on("push-member", (member) => {
    member.socket_id = socket.id;
    pushMember(member);      
  });

  
  // sự kiện liên quan tới room

  socket.on("join-room", (room) => {      
    // //gán room cho socket hiện tại
    socket.join(room);     

    // //gọi tới hàm joinroom trong class members
    joinRoom(socket.id,room);
      //emit cập nhật lại thành viên hiện có trong room tương ứng
    io.to(room).emit('members-in-room',membersInRoom(room)); 

    //cập nhật lại danh sách thành viên không tham gia vào phòng nào
    io.sockets.emit('members-nin-room',membersNinRoom());    
   
  });

  socket.on('get-members-nin-room',()=>{
    //lắng nghe sự kiện lấy những thành viên hiện đang không tham gia phòng thi nào
    let room = getRoom(socket.id);
    io.to(room).emit('members-nin-room',membersNinRoom());
  });

  socket.on('invite-member',(data)=>{
    let invitation = {
      invitee:getMember(socket.id).fullname,
      room:getMember(socket.id).room,
      room_title:data.room_title
    }
    io.to(data.socket_id).emit('send-invitation',invitation);
  });

  socket.on('leave-room',()=>{
    //sự kiện rời phòng thi được gọi khi modal room bị tắt
    let room = getRoom(socket.id);  
    leaveRoom(socket.id);
    io.to(room).emit('members-in-room',membersInRoom(room)); 
    
    //cập nhật lại danh sách thành viên không tham gia vào phòng nào
     io.sockets.emit('members-nin-room',membersNinRoom());  
  });

  socket.on('populate-rooms',()=>{
    io.sockets.emit('load-rooms');
  });

  socket.on('request-exam',(data)=>{
    io.sockets.emit('load-rooms');
    let room = getRoom(socket.id);
    onExam(room);
    let exam = {
      room:room,
      questions:data.questions,
      onExam:true
    };
    pushExam(exam);
    io.to(room).emit('populate-exam',data);
  });

  socket.on('finish-exam',()=>{
    finishExam(socket.id);
    let room = getRoom(socket.id);
    //emit cập nhật lại thành viên hiện có trong room tương ứng
    io.to(room).emit('members-in-room',membersInRoom(room)); 
    if(finishRoom(getRoom(socket.id))){
      io.to(room).emit('populate-answers',getExam(room));
    }
  });

  socket.on('request-rank',correct=>{
    pushResult(socket.id,correct);
    let room = getRoom(socket.id);
    let data = {
      members:sortRank(room),
      exam_length:getExam(room).questions.length
    }
    io.to(room).emit('populate-ranks',data);
  });
  
  
  // phần chat room
  socket.on('send-message',message=>{
    console.log(message);
    let data = {
      user:getMember(socket.id),
      message:message
    }
    socket.broadcast.to(getRoom(socket.id)).emit('send-message',data);
  });
  
  
  
  
  
  
  
  
  
  
  //-----------kết thúc sự kiện liên quan tới room
















  socket.on("member-logout", () => {
    removeMember(socket.id);
  });


  socket.on("disconnect", function () {
    vistorDisconnect(socket.id);
    io.sockets.emit("counter", { count: vistorsCount() });

    if(getMember(socket.id)){
      //nếu là thành viên và đang tham gia 1 phòng thi nào đó
      //thì trong sự kiện disconnect cần loại bỏ thành viên này ra khỏi room
      let room = getRoom(socket.id); 
      io.to(room).emit('members-in-room',membersInRoom(room));   
      
      //cập nhật lại danh sách thành viên không tham gia vào phòng nào
      io.sockets.emit('members-nin-room',membersNinRoom());  
     
    }

    removeMember(socket.id);
  });
});
