const users = [];//mảng lưu user

// Join user to chat
function userJoin(socket_id, username,avatar,member_code, room) {
  let chk = users.find(x=>x.socket_id == socket_id);
  if(!chk){//chỉ add user khi user đó chưa có trong room
    const user = {socket_id, username,avatar,member_code, room };
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
function getAllRoooms(){
  return users;
}

// User leaves chat
function userLeave(socket_id) {
  const index = users.findIndex(user => user.socket_id === socket_id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getAllRoooms
};
