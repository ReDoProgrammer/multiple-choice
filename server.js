const express  = require('express');
const app = express();
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');//database
const config = require('./configs/config');
const bodyParser = require('body-parser');//body parser dùng để lấy dữ liệu từ form
const passport = require('passport');

const server = require('http').Server(app);
const io = require('socket.io')(server);

//những hàm liên quan đến user và room
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getAllRoooms
} = require('./utils/rooms');

const {
  pushUser, 
  removeUser,
  getUser,
  getUsers,
  getUsersNotInRoom
} = require('./utils/users');

// những hàm liên quan tới đề thi lưu trữ trên RAM server
const{
  pushExam,
  getExam,
  removeExam
} = require('./utils/exams');


//phần routes của admin
const adminRoutes = require('./routes/admin/admin-route');
const configRoutes = require('./routes/admin/config-route');
const documentRoutes = require('./routes/admin/document-route');
const docTypeRoutes = require('./routes/admin/doctype-route');
const groupRoutes = require('./routes/admin/group-route');
const jobRoutes = require('./routes/admin/job-route');
const memberRoutes = require('./routes/admin/member-route');
const newsRoutes = require('./routes/admin/news-route');
const questionRoutes = require('./routes/admin/question-route');
const subjectRoutes = require('./routes/admin/subject-route');








//phần route của user hoặc guest
const censorRoutes = require('./routes/user/censor-route');
const commentRoutes = require('./routes/user/comment-route');
const contributeQuestionRoutes = require('./routes/user/contribute-question-route');
const examRoutes = require('./routes/user/exam-route');
const facebookRoutes = require('./routes/user/facebook-route');
const googleRoutes = require('./routes/user/google-route');
const homeRoutes = require('./routes/user/home-route');
const liveRoutes = require('./routes/user/lived-exam-route');
const replytRoutes = require('./routes/user/reply-route');
const socialAuthRoutes = require('./routes/user/social-auth-route');
const statisticRoutes = require('./routes/user/statistic-route');
const userRoutes = require('./routes/user/user-route');


app.set('view engine','ejs');//set view engine cho nodejs
app.set('views',"./views");//set thư mục view cho project
app.use(express.static("./public"));//set đường dẫn tới thư mục public gồm css,js,bootstrap...
app.use(expressLayouts);//set layout

//cấu hình session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.secretKey,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: config.fb_api.clientID,
    clientSecret: config.fb_api.clientSecret,
    callbackURL: config.fb_api.callbackURL,
    profileFields: config.fb_api.profileFields
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


/*
  ROUTE
*/
//phần routes admin
app.use('/admin',adminRoutes);
app.use('/admin/config',configRoutes);
app.use('/admin/document',documentRoutes);
app.use('/admin/document-type',docTypeRoutes);
app.use('/admin/group',groupRoutes);
app.use('/admin/job',jobRoutes);
app.use('/admin/member',memberRoutes);
app.use('/admin/news',newsRoutes);
app.use('/admin/question',questionRoutes);
app.use('/admin/subject',subjectRoutes);






//phần route user

app.use('/censor',censorRoutes);//route kiểm duyệt câu hỏi
app.use('/comment',commentRoutes);//route bình luận
app.use('/contribute-question',contributeQuestionRoutes);//đóng góp câu hỏi
app.use('/lam-bai-thi',examRoutes);//route làm bài thi
app.use('/',facebookRoutes);//route facebook
app.use('/',googleRoutes);//route google
app.use('/',homeRoutes);//route trang chủ
app.use('/live',liveRoutes);//route làm bài trực tuyến
app.use('/reply',replytRoutes);//route trả lời bình luận
app.use('/auth',socialAuthRoutes);//route đăng nhập bằng api mạng xã hội
app.use('/statistic',statisticRoutes);//route thống kê kết quả làm bài
app.use('/user',userRoutes);//route thành viên


mongoose.connect(config.mongodb.mongodb,{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify:false,
  useCreateIndex: true,
},()=>{
	console.log('connect database successfully');
});
server.listen(8080,()=>{
  console.log('server is running ...');
});



var clientIds = [];
io.on('connection',function(socket){
  if(clientIds.indexOf(socket.id)<=-1){
    clientIds.push(socket.id);
    io.sockets.emit('counter', {count:clientIds.length});
  }

  //lắng nghe sự kiện list danh sách thành viên đăng nhập
  socket.on('logged-user',(user)=>{
    let u = user;
    u.socket_id = socket.id;
    pushUser(u);
  });

  socket.on('reply-comment',(data)=>{
    socket.emit('push-notification',data);
  });

//sự kiện tạo mới 
  socket.on('add-room',()=>{
    io.sockets.emit('load-rooms');
  });

  //join vào 1 phòng đã có
  socket.on('join-room',({ username,avatar,member_code, room ,finished})=>{
    const user = userJoin(socket.id, username,avatar,member_code, room,finished);
    socket.join(user.room);
    // Send users and room info
    io.to(user.room).emit('users-in-room', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

    //return all rooms info
    // io.sockets.emit('users-in-rooms',getAllRoooms());
  });

  socket.on('user-finish',()=>{
    const user = getCurrentUser(socket.id);
    if (user) {
      //cập nhật lại users có trong phòng      
      user.finished = true;
      let users = getRoomUsers(user.room);

      //tìm ra người chưa hoàn thành bài thi
      let chk = users.find(x=>x.finished == false);
      if(chk){
        /*
          Nếu vẫn còn người chưa kết thúc bài thi
          - gọi lại hàm users-in-room để cập nhật lại trạng thái
          - của những người đã nộp bài
        */
        io.to(user.room).emit('users-in-room', {
          room: user.room,
          users: users
        });
      }else{ 
        /*
          Khi tất cả user trong room đã hoàn thành bài thi thì:
          - gửi dữ liệu bài thi để công bố đáp án
        */
       io.to(user.room).emit('users-in-room', {
          room: user.room,
          users: users
        });
        io.to(user.room).emit('populate-answers',getExam(user.room));       
      }      
    }
  });

  //hàm lưu kết quả số câu trả lời đúng của user
  socket.on('push-result',(correct)=>{
    const user = getCurrentUser(socket.id);
    if (user) {
      user.correct = correct;
      //gọi tới sự kiện ranks ở client để hiển thị bảng xếp hạng
      io.to(user.room).emit('ranks',{
        users:getRoomUsers(user.room).sort(function(a,b){
          return b.correct - a.correct;
        }),
        exam_length:getExam(user.room).questions.length
      });      

      /*
          Nếu tất cả các user đã push kết quả lên server thành công
          - load lại danh sách room
          - xóa room trên bộ nhớ server
        */
      let chk = getRoomUsers(user.room).find(x=>(!x.correct));
      if(!chk){            
        io.sockets.emit('load-rooms');
        removeExam(user.room);
      }
    }

    
    
  });
  socket.on('send-exam',(data)=>{
    let exam = {room:data.room,questions:data.questions,on_exam:data.on_exam};
    pushExam(exam);
    io.sockets.in(data.room).emit('populate-questions',data);
  });

  //sự kiện lắng nghe list user online mà không tham gia room nào
  socket.on('list-users-not-in-any-room',()=>{
    console.log('list-users-not-in-any-room');
  });

  socket.on('disconnect', function() {
    let index = clientIds.indexOf(socket.id);    
    if (index > -1) {
      clientIds.splice(index, 1);
      io.sockets.emit('counter', {count:clientIds.length});//cập nhật lại số lượng người đang truy cập
    }

    //lấy user rời phòng
    const user = userLeave(socket.id);

    if (user) {
      //cập nhật lại users có trong phòng      
      io.to(user.room).emit('users-in-room', {
        room: user.room,
        users: getRoomUsers(user.room)
      });



      /*
        - Nếu sau khi bắt đầu bài thi & tất cả user trong room đều thoát hết
        1. Xóa room trên server ( tự động)
        2. Xóa bài thi lưu trên server
        3. Xóa room trong csdl
      */
      let userCount =  getRoomUsers(user.room).length;
      let exam = getExam(user.room);
      if(exam && exam.on_exam && userCount == 0){
        removeExam(user.room);
        io.sockets.emit('remove-room',user.room);
      }
    }
  });
});
