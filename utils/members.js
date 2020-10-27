const OnlineMember = require('../models/online_member-model');

function pushMember(member){
    let {socket_id,user} = user;
    OnlineMember.create({
        socket_id:socket_id,
        user:user
    },function(err,mem){
        if(err){
            console.log('push member failed:'+new Errror(err));
        }else{
            return 200;
        }
    })
}
function getMemberBySocketId(socket_id){
    OnlineMember.findOne({socket_id:socket_id},function(err,member){
        if(err){
            console.log('find member failed: '+new Error(err));
        }else{
            return member;
        }
    });
}

function updateSocketId(user_id,socket_id){
    OnlineMember.findOneAndUpdate({user:user_id},{
        socket_id:socket_id
    },{new:true},function(err,member){
        if(err){
            console.log('update socket id failed:'+new Error(err));
        }else{
            return member; 
        }
    })
}

function memberJoinRoom(socket_id,room){
    OnlineMember.findOneAndUpdate({
        socket_id:socket_id
    },{
        room:room
    },{new:true},function(err,member){
        if(err){
            console.log('member join room failed: '+new Error(err));
        }else{
            return member;
        }
    })
}

function getMembers(){
    OnlineMember.find({},function(err,members){
        if(err){
            console.log('find members failed: '+new Error(err));
        }else{
            return members;
        }
    });
}


module.exporst = {
    pushMember,
    getMemberBySocketId,
    updateSocketId,
    memberJoinRoom,
    getMembers
}