const users = [];//mảng lưu user


function userConnect(socket_id){
  let user = {
    socket_id
  }  
  users.push(user);
  console.log('user connect:',users);
  return users;
}


// Join user to chat
function userJoin(socket_id, username,avatar,member_code, room,finished) {
  let chk = users.find(x=>x.socket_id == socket_id && x.room == room);
  if(!chk){//chỉ add user khi user đó chưa có trong room tương ứng
    const user = {socket_id, username,avatar,member_code, room ,finished};
    users.push(user);
    return user;
  }
  return chk;
}

// Get current user
function getCurrentUser(socket_id) {
  return users.find(user => user.socket_id === socket_id);
}

//return all rooms
function getAllRooms(){
  return rooms;
}

// User leaves chat
function userLeave(socket_id) {
  const index = users.findIndex(user => user.socket_id === socket_id);  
  if (index !== -1) {
    return users.splice(index, 1)[0];    
  }
}

// Get room rooms
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userConnect,
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getAllRooms
};
