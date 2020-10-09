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
app.use('/reply',replytRoutes);//route trả lời bình luận
app.use('/auth',socialAuthRoutes);//route đăng nhập bằng api mạng xã hội
app.use('/statistic',statisticRoutes);//route thống kê kết quả làm bài
app.use('/thanh-vien',userRoutes);//route thành viên


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
var members = {};
io.on('connection',function(socket){
  if(clientIds.indexOf(socket.id)<=-1){
    clientIds.push(socket.id);
    io.sockets.emit('counter', {count:clientIds.length});
  }
  socket.on('register-or-comeback',(data)=>{
    if(data.isNew){//nếu là thành viên mới thì cập nhật tổng số thành viên
      io.sockets.emit('total-members');
    }
    members[socket.id] = {username:data.user.username,type:data.type};
    console.log('members:',members);
    socket.emit('load-profile',data.user);//load thông tin ở phía tay phải
    // socket.emit('load-chat-controls',{user:user});//load control bình luận ẩn/hiện control gửi bình luận
    socket.emit('load-top-right',data.user);//load thông tin tài khoản ở góc phải phía trên view
  });

  socket.on('user-logout',()=>{
    socket.emit('user-logout',members[socket.id].type);
  });


  socket.on('disconnect', function() {
    let index = clientIds.indexOf(socket.id);
    if (index > -1) {
      clientIds.splice(index, 1);
      io.sockets.emit('counter', {count:clientIds.length});//cập nhật lại số lượng người đang truy cập
    }

  });
});
