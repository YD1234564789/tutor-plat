const dayjs = require('dayjs')
// 取時分
const removeSeconds = timeString => {
  const parts = timeString.split(":")
  return parts.slice(0, 2).join(':')
}
// 取分鐘數
const removeHoursSeconds = timeString => {
  const parts = timeString.split(":")
  return parts[1]
}
// 01:00:00 > 60 for duration 用
const getTimeInMinutes = timeString => {
  const time = dayjs(timeString, 'HH:mm:ss');
  return time.hour() * 60 + time.minute();
}

const toMinutes = timeString => {
  let [hour, minutes, second] = timeString.split(":").map(Number)
  let total = hour * 60 + minutes
  return total
}
module.exports = {
  removeSeconds,
  removeHoursSeconds,
  getTimeInMinutes,
  toMinutes
  }