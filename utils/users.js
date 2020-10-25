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
  console.log('online user:',users.length);
  return users;
}

//hàm xử lý sự kiện người dùng thoát khỏi trình duyệt web
function userDisconnect(socket_id) {
  const index = users.findIndex((user) => user.socket_id === socket_id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  console.log("user disconnected: ", users.length);
  return users;
}

function userLoggedIn(user) {
  let chk = users.find((x) => x.username === user.username);
  if (!chk) {
    users.push(user);
  }
  console.log("users logged in: ", users.find(x=>x.username !=='undefined').length);
  return users;
}

// Join user to exam room
function userJoin(socket_id, username, avatar, member_code, room, finished) {
  let chk = users.find((x) => x.socket_id == socket_id && x.room == room);
  if (!chk) {
    //chỉ add user khi user đó chưa có trong room tương ứng
    const user = { socket_id, username, avatar, member_code, room, finished };
    users.push(user);
    return user;
  }
  return chk;
}

// Get current user
function getCurrentUser(socket_id) {
  return users.find((user) => user.socket_id === socket_id);
}

//return all rooms
function getAllUsers() {
  return users;
}

// User leaves chat
function userLeave(socket_id) {
  const index = users.findIndex((user) => user.socket_id === socket_id);
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
  userDisconnect,
  userLoggedIn,
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getAllUsers,
};
