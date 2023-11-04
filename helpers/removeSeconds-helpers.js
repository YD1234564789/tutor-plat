const dayjs = require('dayjs')
const removeSeconds = timeString => {
  const parts = timeString.split(":")
  return parts.slice(0, 2).join(':')
}

const removeHoursSeconds = timeString => {
  const parts = timeString.split(":")
  return parts[1]
}

const getTimeInMinutes = timeString => {
  const time = dayjs(timeString, 'HH:mm:ss');
  return time.hour() * 60 + time.minute();
}

module.exports = {
  removeSeconds,
  removeHoursSeconds,
  getTimeInMinutes
  }