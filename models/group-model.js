const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name:{type:String,default:''},
  meta:{type:String,default:''},
  subjects:[{
      type:Schema.Types.ObjectId,
      ref:'subject'
    }
  ]
});

module.exports = mongoose.model("group",groupSchema);
