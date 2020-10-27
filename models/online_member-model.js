const mongoose=require('mongoose');
const Schema = mongoose.Schema;


const onlineMembers = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    socket_id:{
        type:String,
        default:''
    },
    room:{
        type:Schema.Types.ObjectId,
        ref:'room'
    }
});

module.exports = mongoose.model("onlne_member",onlineMembers);
