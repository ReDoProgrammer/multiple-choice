members = [];

function pushMember(member){
    members.push(member);
}

function getMemberBySocketId(socket_id){
    return members.filter(x=>x.socket_id === socket_id)[0];
}

function removeMemberBySocketId(socket_id){
    const index = members.findIndex(x => x.socket_id === socket_id);
    if (index !== -1) {
        return members.splice(index, 1)[0];
    } 
}

function joinRoom(socket_id,room){
    let tmp = getMemberBySocketId(socket_id);       
    let member =tmp;
    member.room = room;
    removeMemberBySocketId(tmp.socket_id); 
    pushMember(member);   
}

function leaveRoom(socket_id){
    let tmp = getMemberBySocketId(socket_id);
    let member = {
        username:tmp.username,
        member_code:tmp.member_code,
        avatar:tmp.avatar,
        fullname:tmp.fullname,
        socket_id:socket_id
    }
    removeMemberBySocketId(socket_id); 
    pushMember(member);  
}

function membersNiNRoom(){
    return members.filter(x=>!x.room);
}

function getMembers(){
    return members;
}



module.exports = {
    pushMember,
    removeMemberBySocketId,
    getMemberBySocketId,  
    joinRoom,
    leaveRoom,
    membersNiNRoom,
    getMembers
}