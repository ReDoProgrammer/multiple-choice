const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const common = require('../common/common');

const censorHistorySchema = new Schema({
  question:{
    type:Schema.Types.ObjectId,
    ref:'question'
  },
  user:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },
  created_at:{type:String,default:common.currentTime}
});

module.exports = mongoose.model("censor-history",censorHistorySchema);
