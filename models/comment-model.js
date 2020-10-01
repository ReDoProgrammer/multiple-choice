const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const common = require('../common/common');

const commentSchema = new Schema({
  group: {type:String,default:''},
  subject:{type:String,default:''},
  parent_id:{type:String,default:''},
  comment:{type:String,default:''},
  like:{type:Number,default:0},
  dislike:{type:Number,default:0},
  created_at:{type:String,default:common.currentTime},
  user:{
      type:Schema.Types.ObjectId,
      ref:'user'
    }
});

module.exports = mongoose.model("comment",commentSchema);
