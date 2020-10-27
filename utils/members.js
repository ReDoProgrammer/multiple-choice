members = [];

function pushMember(member){
    members.push(member);
}

function getMemberBySocketId(socket_id){
    return members.filter(x=>x.socket_id === socket_id);
}

async function updateRoom(socket_id,room){
    const query = {socket_id:socket_id};
    const updateDocument = {
        $set:{
            "room":room
        }
    }
    const result = await members.updateOne(query,updateDocument);
    return result;
}

module.exports = {
    pushMember,
    getMemberBySocketId,
    updateRoom
}