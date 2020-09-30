const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  question:{type:String,default:''},
  option_a:{type:String,default:''},
  user:[{
    type: Schema.Types.ObjectId,
    ref:'user'
  }]
});


module.exports = mongoose.model("job",jobSchema);
