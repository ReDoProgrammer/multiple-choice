visitors = [];

function visitorConnect(socket_id){
    visitors.push(socket_id);
}

function vistorDisconnect(socket_id){
    const index = visitors.findIndex(x => x.socket_id === socket_id);
    if (index !== -1) {
        return visitors.splice(index, 1)[0];
    } 
}

function vistorsCount(){
    return visitors.length;
}

module.exports = {
    visitorConnect,
    vistorDisconnect,
    vistorsCount
}