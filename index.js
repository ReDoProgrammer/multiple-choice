const express  = require('express');
const app = express();
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const config = require('./configs/config');
const bodyParser = require('body-parser');//body parser dùng để lấy dữ liệu từ form

//phần routes của admin

const adminRoutes = require('./routes/admin/admin-route');
const groupRoutes = require('./routes/admin/group-route');
const subjectRoutes = require('./routes/admin/subject-route');


//phần route của user hoặc guest
const homeRoutes = require('./routes/user/home-route');
const examRoutes = require('./routes/user/exam-route');
// const userRoutes = require('./routes/user-route');


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

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//gọi tới các route đã được khai báo
//các route phải đặt sau cấu hình của body parser thì mới gọi được tới các thuộc tính của body
// app.use('/',homeRoutes);


//phần routes admin
app.use('/admin',adminRoutes);
app.use('/admin/group',groupRoutes);
app.use('/admin/subject',subjectRoutes);

//phần route user
app.use('/',homeRoutes);//route trang chủ
app.use('/lam-bai-thi',examRoutes);//route trang chủ



mongoose.connect(config.mongodb.mongodb,{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify:false
},()=>{
	console.log('connect database successfully');
});
app.listen(3000,()=>{
	console.log("app is running on port 3000");
});
