const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const common = require('../common/common');

const groupSchema = new Schema({
  group: {type:String,default:''},
  subject:{type:String,default:''},
  parent_id:{type:String,default:''},
  comment:{type:String,default:''},
  like:{type:Number,default:0},
  created_at:{type:String,default:common.currentTime},
  subjects:[{
      type:Schema.Types.ObjectId,
      ref:'subject'
    }
  ]
});

module.exports = mongoose.model("group",groupSchema);
