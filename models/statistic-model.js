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
  ratio:[Number]
});


module.exports = mongoose.model("statistic",statisticSchema);
