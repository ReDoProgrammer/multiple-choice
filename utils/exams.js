exams = [];

function pushExam({room,questions,on_exam}){
    let exam = {room,questions,on_exam}
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