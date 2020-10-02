const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const docTypeSchema = new Schema({
  name:{type:String,default:'',unique:true},
  meta:{type:String,default:'',unique:true},
  icon:{type:String,default:''},
  icon_class:{type:String,default:''},
  documents:[{
    type:Schema.Types.ObjectId,
    ref:'document'
  }]
});

module.exports = mongoose.model("doc_type",docTypeSchema);
