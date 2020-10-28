visitors = [];

function visitorConnect(socket_id){
    visitors.push(socket_id);
}

function vistorDisconnect(socket_id){
    visitors = visitors.filter(x=>x!==socket_id);
}

function vistorsCount(){
    return visitors.length;
}

module.exports = {
    visitorConnect,
    vistorDisconnect,
    vistorsCount
}