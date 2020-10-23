const users = [];//mảng lưu user

// Join user to chat
function userJoin(id, username,avatar,member_code, room) {
  const user = {socket_id, username,avatar,member_code, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(socket_id) {
  return users.find(user => user.socket_id === socket_id);
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
  getRoomUsers
};
