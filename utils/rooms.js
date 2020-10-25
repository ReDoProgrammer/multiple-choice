const rooms = [];//mảng lưu user

// Join user to chat
function userJoin(socket_id, username,avatar,member_code, room,finished) {
  let chk = rooms.find(x=>x.socket_id == socket_id && x.room == room);
  if(!chk){//chỉ add user khi user đó chưa có trong room tương ứng
    const user = {socket_id, username,avatar,member_code, room ,finished};
    rooms.push(user);
    return user;
  }
  return chk;
}

// Get current user
function getCurrentUser(socket_id) {
  return rooms.find(user => user.socket_id === socket_id);
}

//return all rooms
function getAllRoooms(){
  return rooms;
}

// User leaves chat
function userLeave(socket_id) {
  const index = rooms.findIndex(user => user.socket_id === socket_id);  
  if (index !== -1) {
    return rooms.splice(index, 1)[0];    
  }
}

// Get room rooms
function getRoomrooms(room) {
  return rooms.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomrooms,
  getAllRoooms
};
