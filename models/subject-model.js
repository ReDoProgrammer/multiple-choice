const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name:{type:String,default:''},
  meta:{type:String,default:''},
  description:{type:String,default:''},
  group:{
    type: Schema.Types.ObjectId,
    ref:  'group'
  },
  questions:[{
    type:Schema.Types.ObjectId,
    ref:'question'
  }],
  created_by:{
    type:Schema.Types.ObjectId,
    ref:'user'
  },
  is_actived:{type:Boolean,default:false},
  order:{type:Number,default: 0},
  statistics:[{
    type:Schema.Types.ObjectId,
    ref:'statistic'
  }]
});

module.exports = mongoose.model("subject",subjectSchema);
