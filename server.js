const express  = require('express');
const app = express();
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');//database
const config = require('./configs/config');
const bodyParser = require('body-parser');//body parser dùng để lấy dữ liệu từ form
const passport = require('passport');


//phần routes của admin
const adminRoutes = require('./routes/admin/admin-route');
const groupRoutes = require('./routes/admin/group-route');
const subjectRoutes = require('./routes/admin/subject-route');
const questionRoutes = require('./routes/admin/question-route');
const jobRoutes = require('./routes/admin/job-route');
const docTypeRoutes = require('./routes/admin/doctype-route');
const documentRoutes = require('./routes/admin/document-route');
const memberRoutes = require('./routes/admin/member-route');



//phần route của user hoặc guest
const userRoutes = require('./routes/user/user-route');
const homeRoutes = require('./routes/user/home-route');
const examRoutes = require('./routes/user/exam-route');
const facebookRoutes = require('./routes/user/facebook-route');
const googleRoutes = require('./routes/user/google-route');
const commentRoutes = require('./routes/user/comment-route');
const contributeQuestionRoutes = require('./routes/user/contribute-question-route');


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
app.use('/admin/group',groupRoutes);
app.use('/admin/subject',subjectRoutes);
app.use('/admin/question',questionRoutes);
app.use('/admin/job',jobRoutes);
app.use('/admin/document-type',docTypeRoutes);
app.use('/admin/document',documentRoutes);
app.use('/admin/member',memberRoutes);

//phần route user
app.use('/thanh-vien',userRoutes);//route thành viên
app.use('/',facebookRoutes);//route facebook
app.use('/',googleRoutes);//route google
app.use('/',homeRoutes);//route trang chủ
// app.use('/view',examRoutes);//route làm bài thi
app.use('/comment',commentRoutes);//route bình luận
app.use('/contribute-question',contributeQuestionRoutes);//đóng góp câu hỏi



mongoose.connect(config.mongodb.mongodb,{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify:false,
  useCreateIndex: true,
},()=>{
	console.log('connect database successfully');
});
app.listen(8080,()=>{
	console.log("app is running on port 8080");
});
