var { DateTime } = require('luxon');
module.exports.MemberCode = ()=>{

  let d = DateTime.local();
  let day = d.c.day;
  let month = d.c.month;
  let year = d.c.year ;
  let hour = d.c.hour;
  let minutes = d.c.minute;
  let seconds = d.c.second;
  let millisecond = d.c.millisecond;
  return year+month+day+hour+minutes+seconds+millisecond;
}

module.exports.currentTime = ()=>{
  let d = DateTime.local();
  let day = d.c.day<10?'0'+d.c.day:d.c.day;
  let month = d.c.month<10?'0'+d.c.month:d.c.month;
  let year = d.c.year ;
  let hour = d.c.hour<10?'0'+d.c.hour:d.c.hour;
  let minutes = d.c.minute<10?'0'+d.c.minute:d.c.minute;
  let seconds = d.c.second<10?'0'+d.second:d.second;

  return  day+'/'+month+'/'+year+' '+hour+':'+minutes+':'+seconds;
}
