const mongoose=require('mongoose');
const Schema = mongoose.Schema;


const livedExamSchema = new Schema({
  room:{//phòng thi
    type:Schema.Types.ObjectId,
    ref:'room'
  },
  user:{//user thi
    type:Schema.Types.ObjectId,
    ref:'user'
  },
  result:[]//gồm nhiều object, mỗi object gồm id câu hỏi và đáp án của người dùng
});


module.exports = mongoose.model("lived-exam",livedExamSchema);
