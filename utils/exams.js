exams = [];

function pushExam({room,questions,status}){
    let exam = {room,questions,status}
    exams.push(exam);
}

function getExam(room){
    return exams.find(x=>x.room === room);
}

function removeExam(room){
    const index = exams.findIndex(x => x.room === room);  
    if (index !== -1) {        
        return exams.splice(index, 1)[0];    
    }
}

module.exports = {
    pushExam,
    getExam,
    removeExam
}