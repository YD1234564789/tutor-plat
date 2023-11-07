const { Teacher_info, User, Course } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')
const { removeSeconds, toMinutes } = require('../helpers/formatTime-helpers')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const teacherController = {
  getNewTeacher: (req, res, next) => {
    const WEEK = { 1: "星期一", 2: "星期二", 3: "星期三", 4: "星期四", 5: "星期五", 6: "星期六", 7: "星期日" }
    res.render('teachers/apply', { WEEK })
  },
  postTeacher: (req, res, next) => {
    const { method, classLink, weekDay, startTime, endTime, duration } = req.body
    if (!method || !classLink || !weekDay || !startTime || !endTime || !duration) throw new Error('All infomation needed！')
    return Teacher_info.create({
      method,
      classLink,
      weekDay: JSON.stringify(weekDay),
      startTime,
      endTime,
      duration,
      userId: req.user.id
    })
    .then(() => {
      req.flash('success_messages', '成功成為老師!')
      res.redirect('/teachers/myProfile')
    })
    .catch(err => next(err))
  },
  myProfile: (req, res, next) => {
    return Promise.all([
      Teacher_info.findByPk(req.params.id, {
        include: User,
        nest: true,
        raw: true,
      }),
      Course.findAll({
        where: {
          teacherInfoId: req.params.id
        },
        
        raw:true,
      })
    ])
      .then(([teacher, courses]) => {
        if (!teacher) throw new Error("Teacher diidn't exist!")
        const data = courses.map(c => {
          const sTime = removeSeconds(c.startTime)
          const eTime = removeSeconds(c.endTime)
          const date = c.date
          return {
            ...c,
            startTime: sTime,
            endTime: eTime,
            date
          }
        })
        return res.render('teachers/myProfile', { teacher, courses: data })
      })
      .catch(err => next(err))
  },
  getTeacher: (req, res, next) => {
    return Promise.all([
      Teacher_info.findByPk(req.params.id, {
        include: User,
        nest: true,
        raw: true,
      }),
      Course.findAll({
        where: {
          teacherInfoId: req.params.id
        },
        raw: true,
      })
    ])
      .then(([teacher, courses]) => {
        if (!teacher) throw new Error("Teacher diidn't exist!")
        // 因要計算先用dayjs轉物件，最後存入值要format過
        const sTime = dayjs(teacher.startTime, "HH:mm:ss")
        const eTime = dayjs(teacher.endTime, "HH:mm:ss")
        const duration = toMinutes(teacher.duration)
        const weekDay = teacher.weekDay
        const solts = eTime.diff(sTime, "minute") / duration

        const schedule = []
        const today = dayjs()
        // each已預約課程，簡化後push到新陣列
        const bookedCourses = []
        courses.forEach(course => {
          const book = course.date + "-" + course.startTime
          bookedCourses.push(book)
        })

        for (let i = 0; i< 14; i++) {
          const date = today.add(i, "day")
          const dateFormat = date.format("YYYY-MM-DD")
          // 判斷weekDay陣列中有無包括date的星期沒有則date+1
          if (weekDay.includes(date.get("day"))) {
            for (let j = 0; j< solts; j++) {
              const start = sTime.add(j * duration, "minute")
              const startTime = start.format("HH:mm:ss")
              const endTime = start.add(duration, "minute").format("HH:mm")
              // 判斷*目前*時間是否再已預約清單 否則push
              if (!bookedCourses.includes(`${dateFormat}-${startTime}`)) {
                schedule.push({
                  date: dateFormat,
                  startTime: removeSeconds(startTime),
                  endTime
                })
              }
            }
          }
        }
        return res.render('teachers/teacherProfile', { teacher, courses, schedule })
      })
      .catch(err => next(err))
  },
  editPage: (req, res) => {
    const data = req.user
    data.Teacher_info.startTime = removeSeconds(data.Teacher_info.startTime)
    data.Teacher_info.endTime = removeSeconds(data.Teacher_info.endTime)
    data.Teacher_info.duration = toMinutes(data.Teacher_info.duration)
    const WEEK = { 1: "星期一", 2: "星期二", 3: "星期三", 4: "星期四", 5: "星期五", 6: "星期六", 7: "星期日"}
    // 登入的user已帶入teacher身分，沒有則null
    res.render('teachers/edit', { user: data, WEEK })
  },
  putTeacher: (req, res, next) => {
    const { file } = req
    const { name, country, method, classLink, weekDay, description } = req.body
    const startTime = dayjs(req.body.startTime, "HH:mm:ss")
    const endTime = dayjs(req.body.endTime, "HH:mm:ss") 
    const duration = dayjs(req.body.duration, "HH:mm:ss")
    const timeDifference = endTime.diff(startTime, 'minute') - duration.diff(dayjs("00:00:00", "HH:mm:ss"), "minute")
    if (!name || !country || !method) throw new Error('Name and Country and Method they are required')
    if (timeDifference <0) throw new Error('開始時間、結束時間與課程時間設定有誤')
      return Teacher_info.findByPk(req.params.id)
      .then(teacher => {
        if (!teacher) throw new Error("Teacher didn't exist")
        return teacher.update({
          method,
          classLink,
          weekDay: JSON.stringify(weekDay),
          startTime: startTime.format("HH:mm"),
          endTime: endTime.format("HH:mm"),
          duration: duration.format("HH:mm")
        })
      })
      .then(updateTeacher => {  
        const teacherJSON = updateTeacher.toJSON()
        return Promise.all([
            User.findByPk(teacherJSON.userId),
            imgurFileHandler(file)
        ])
      })
      .then(([user, filePath]) => {
        return user.update({
          name,
          country,
          description,
          avatar: filePath || user.avatar
        })
      })
      .then(() => {
        req.flash('success_messages', 'Info was successfully to update')
        res.redirect(`/teachers/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  postReserve: (req, res, next) => {
    const { bookDate } = req.body
    const formatDate = bookDate.split(" ")
    const date = dayjs(formatDate[0], "YYYY-MM-DD")
    const startTime = dayjs(formatDate[1], "HH:mm")
    const endTime = dayjs(formatDate[2], "HH:mm")
    const user = req.user

    if (!dayjs(date).isValid()) throw new Error('請選擇日期！')
    return Teacher_info.findByPk(req.params.id,{ raw: true })
      .then(teacher => {
        if (teacher.id === user.id) {
          req.flash('error_messages', '不能預約自己的課程！')
          return res.redirect(`/teachers/${teacher.id}`)
        }
        return Course.create({
          startTime: startTime.format("HH:mm"),
          endTime: endTime.format("HH:mm"),
          date: date.format("YYYY-MM-DD"),
          isDone: 0,
          userId: user.id,
          teacherInfoId: teacher.id
        })
      })
      .catch(err => next(err))
  },
  putScore: (req, res, next) => {

  }
}

module.exports = teacherController