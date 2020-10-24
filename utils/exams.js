exams = [];

function pushExam({room,questions}){
    let exam = {room,questions}
    console.log('exam pushed: ',exam);
    exams.push(exam);
}

function getExam(room){
    console.log('get exam: ',exams.find(x=>x.room === room));
    return exams.find(x=>x.room === room);
}

function removeExam(room){
    const index = exams.findIndex(x => x.room === room);  
    if (index !== -1) {        
        console.log('found an exam');
        return exams.splice(index, 1)[0];    
    }
}

module.exports = {
    pushExam,
    getExam,
    removeExam
}