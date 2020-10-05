const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const common = require('../common/common');

const replySchema = new Schema({
  reply:{type:String,default:''},
  like:{type:Number,default:0},
  dislike:{type:Number,default:0},
  created_at:{type:String,default:common.currentTime},
  user:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },
  comment:{
    type:Schema.Types.ObjectId,
    ref:'comment'
  }
});

module.exports = mongoose.model("reply",replySchema);
