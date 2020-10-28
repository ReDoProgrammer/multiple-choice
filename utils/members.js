const e = require("express");
const { remove } = require("../models/job-model");

members = [];

function pushMember(member){
    members.push(member);
}
function getMember(socket_id){
    return members.filter(x=>x.socket_id === socket_id)[0];
}
function removeMember(socket_id){
    members = members.filter(x=>x.socket_id !==socket_id);
}

function allMembers(){
    return members;
}


//hàm liên quan tới room 
function joinRoom(socket_id,room){
    let tmp = getMember(socket_id);  
    removeMember(socket_id);
    tmp.room = room;
    pushMember(tmp);
}
function getRoom(socket_id){
    return getMember(socket_id).room;
}
function membersInRoom(room){    
    return members.filter(x=>x.room === room);
}

function membersNinRoom(room){
    return members.filter(x=>!x.room);
}

function onExam(room){
    membersInRoom(room).forEach(member => {
        tmp = member;
        removeMember(member);
        tmp.onExam = true;
        pushMember(tmp);
    });
}

function finishExam(socket_id){
    membersInRoom(getRoom(socket_id)).forEach(member=>{
        tmp = getMember(member.socket_id);
        removeMember(member.socket_id);
        if(tmp.socket_id === socket_id){
            tmp.finishExam = true;
        }       
        pushMember(tmp);
    });    
}

function pushResult(socket_id,correct){
    tmp = getMember(socket_id);
    removeMember(socket_id);
    tmp.correct = correct;
    pushMember(tmp);
}

function checkPushResultAll(room){
    return membersInRoom(room).find(x=>!x.correct);
}

function sortRank(room){
   return membersInRoom(room).sort(function(a,b){
       return b.correct - a.correct;
   });
}

function finishRoom(room){
    return membersInRoom(room).find(x=>!x.finishExam)==undefined;
}

function leaveRoom(socket_id){   
   members = members.filter(x=>x.socket_id !== socket_id);
}

module.exports = {
   pushMember,
   getMember,
   joinRoom,
   getRoom,
   membersInRoom,
   membersNinRoom,
   onExam,
   finishExam,
   pushResult,
   checkPushResultAll,
   sortRank,
   finishRoom,
   leaveRoom,
   removeMember,
   allMembers
}