/*
MODEL NÀY DÙNG ĐỂ LƯU TRỮ THÔNG TIN PHÒNG THI TRỰC TUYẾN
*/
const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const common = require('../common/common');

const livedRoomSchema = new Schema({
  subject:{
    type:Schema.Types.ObjectId,
    ref:'subject'
  },
  created_at:{type:String,default:common.currentTime},
  created_by:{
    type:Schema.Types.ObjectId,
    ref:'user'
  },
  questions:[{
    type:Schema.Types.ObjectId,
    ref:'question'
  }],
  users:[{
    type: Schema.Types.ObjectId,
    ref:'user'
  }]
});


module.exports = mongoose.model("room",livedRoomSchema);
