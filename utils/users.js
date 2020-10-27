const users = []; //mảng lưu user

//hàm xử lý sự kiện khi người dùng truy cập web
function userConnect(socket_id) {
  const index = users.findIndex(x => x.socket_id === socket_id);
  if (index == -1) {
    let user = {
      socket_id,
    };
    users.push(user);
  }
  return users;
}


function userLoggedIn(user) {  
  userLeave(user.socket_id);
  users.push(user);
  return users;
}

// Join user to exam room
function userJoin(socket_id, username,fullname,avatar, member_code, room, finished) {
    userLeave(socket_id);
    const user = { socket_id, username,fullname, avatar, member_code, room, finished };
    users.push(user);
    return user;
}



// Get current user
function getCurrentUser(socket_id) {
  return users.find((user) => user.socket_id === socket_id);
}

//get user by username
function getUserByUsername(username){
  return users.find(x=>x.username == username);
}

//return all rooms
function getAllUsers() {
  return users;
}

// User disconnect
function userLeave(socket_id) {
  const index = users.findIndex(x => x.socket_id === socket_id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  } 
}



// Get room rooms
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userConnect,
  userLoggedIn,
  userJoin,
  getCurrentUser,
  userLeave,
  getUserByUsername,
  getRoomUsers,
  getAllUsers,
};
