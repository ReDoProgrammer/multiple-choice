users = [];
const {
    getAllRoooms
} = require('./rooms');


//hàm lưu user đã đăng nhập vào mảng trên server
function pushUser(user){
    u = users.find(x=>x._id == user._id);
    if(!u){
        users.push(user);
        console.log('all users:',users);
    }
}

//hàm giải phóng bộ nhớ lưu user hiện tại
function removeUser(socket_id){
    const index = users.findIndex(x => x.socket_id === socket_id);  
  if (index !== -1) {
    return users.splice(index, 1)[0];    
  }
}

function getUser(socket_id){
    return users.find(x=>x.socket_id ===  socket_id);
}

function getUsers(){
    return users;
}

function getUsersNotInRoom(){
    rooms = getAllRoooms();
    console.log(rooms);
}

module.exports = {
    pushUser, 
    removeUser,
    getUser,
    getUsers,
    getUsersNotInRoom
}

