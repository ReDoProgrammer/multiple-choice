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
  number_of_questions:{type:Number,default:0},
  duration:{type:Number,default:0},
  created_by:{
    type:Schema.Types.ObjectId,
    ref:'user'
  },
  questions:[{
    type:Schema.Types.ObjectId,
    ref:'question'
  }],
  registers:[{
    type:Schema.Types.ObjectId,
    ref:'user'
  }],
  users:[{
    type: Schema.Types.ObjectId,
    ref:'user'
  }],
  started_time:{type: Date},
  status:{type:Number,default:-1}
});


module.exports = mongoose.model("room",livedRoomSchema);
