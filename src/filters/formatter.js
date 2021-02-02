
export  const normalTime = (time) => {
  if(time){
    let odate = new Date()
    odate.setTime(time)
    let year = odate.getFullYear()
    let month = odate.getMonth()+1
    let day = odate.getDate()
    let hours = odate.getHours()
    let minutes = odate.getMinutes()
    let seconds = odate.getSeconds()
    return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds
  }
}
  