members = [];

function pushMemeber(member){
    members.pushMemeber(member);
    findAndUpdateMember(member.username);
}

function removeMemberBySocketId(socket_id){
    const index = members.findIndex(x => x.socket_id === socket_id);
    if (index !== -1) {
        return members.splice(index, 1)[0];
    } 
}



function findAndUpdateMember(username){
    let member = members.filter(x=>x.username === username);
    member.room = '11111111111111111';
    console.log(members);
}

module.exports ={
    pushMemeber,
    removeMemberBySocketId,
    findAndUpdateMember
}