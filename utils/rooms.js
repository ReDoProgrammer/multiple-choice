// mảng lưu rooms
rooms = [];

//hàm thêm thông tin 1 room mới
function pushRoom({room,user}){
    room.push({room,user});
}

//hàm lấy thông tin user của chủ phòng
function getRoomMaster(room){
    return rooms.find(x=>x.room === room);
}

module.exports = {
    pushRoom,
    getRoomMaster
};