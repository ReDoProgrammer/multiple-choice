const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const statisticSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref:'user'
  },
  subject:{
    type:Schema.Types.ObjectId,
    ref:'subject'
  },
  times:{type:Number,default:1},
  equals_100:{type:Number,default:0},
  uper_90:{type:Number,default:0},
  uper_80:{type:Number,default:0},
  uper_70:{type:Number,default:0},
  uper_50:{type:Number,default:0},
  uper_30:{type:Number,default:0},
  lower_30:{type:Number,default:0}
});


module.exports = mongoose.model("statistic",statisticSchema);
