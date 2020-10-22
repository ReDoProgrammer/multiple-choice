const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  subject:{
    type:Schema.Types.ObjectId,
    ref:'subject'
  },
  maters:{
    type: Schema.Types.ObjectId,
    ref:'user'
  },
  questions:[{
    Types:Schema.Types.ObjectId,
    ref:'question'
  }]

});


module.exports = mongoose.model("job",jobSchema);
