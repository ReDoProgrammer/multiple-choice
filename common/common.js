var { DateTime } = require('luxon');
module.exports.MemberCode = ()=>{

  let d = DateTime.local();
  let date = d.c.year<10?'0'+d.c.year:d.c.year;
  let month = d.c.month<10?'0'+d.c.month:d.c.month;
  let year = d.c.year ;
  let hour = d.c.hour<10?'0'+d.c.hour:d.c.hour;
  let minutes = d.c.minute<10?'0'+d.c.minute:d.c.minute;
  let seconds = d.c.second<10?'0'+d.second:d.second;
  return  (year+month+date+hour+minutes+seconds);
}

module.exports.currentTime = ()=>{
  let d = DateTime.local();
  let date = d.c.year<10?'0'+d.c.year:d.c.year;
  let month = d.c.month<10?'0'+d.c.month:d.c.month;
  let year = d.c.year ;
  let hour = d.c.hour<10?'0'+d.c.hour:d.c.hour;
  let minutes = d.c.minute<10?'0'+d.c.minute:d.c.minute;

  return  parse('%s/%s/%s %s:%s',date,month,year,hour,minutes);
}
