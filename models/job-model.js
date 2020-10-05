const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  name:{type:String,default:''},
  users:[{
    type: Schema.Types.ObjectId,
    ref:'user'
  }]
});


module.exports = mongoose.model("job",jobSchema);
