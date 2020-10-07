/*
MODEL NÀY DÙNG ĐỂ LƯU TRỮ TIN TỨC SHOW Ở TRANG CHỦ
*/
const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const common = require('../common/common');

const newsSchema = new Schema({
  title:{type:String,default:''},
  meta:{type:String,default:''},
  description:{type:String,default:''},
  content: {type:String,default:''},
  created_at:{type:String,default:common.currentTime},
  users:[{
    type: Schema.Types.ObjectId,
    ref:'user'
  }]
});


module.exports = mongoose.model("news",newsSchema);
