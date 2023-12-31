const { Teacher_info, User, Course, sequelize } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')
const { removeSeconds, toMinutes } = require('../helpers/formatTime-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { Op } = require('sequelize')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const teacherServices = {
  getTeachers: (req, cb) => {
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Course.findAll({
        where: { isDone: true },
        attributes: ['userId', [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration']],
        group: ['userId'],
        order: [[sequelize.fn('SUM', sequelize.col('duration')), 'DESC']],
        limit: 10,
        include: [{
          model: User,
          attributes: ['name', 'avatar']
        }],
        raw: true,
        nest: true
      }),
      Teacher_info.findAndCountAll({
        include: User,
        limit,
        offset,
        nest: true,
        raw: true,
      })
    ])
      .then(([topLearnUsers, teachers]) => {
        const data = topLearnUsers.map((u, index) => {
          const learnHour = Number(u.totalDuration) / 60
          return {
            ...u,
            totalDuration: learnHour,
            rank: index + 1
          }
        })
        return cb(null, {
          teachers: teachers.rows,
          pagination: getPagination(limit, page, teachers.count),
          topLearnUsers: data
        })
      })
      .catch(err => cb(err))
  },
  teacherSearch: (req, cb) => {
    const keyword = req.query.keyword.trim()
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      // TOP10 learnTime user
      Course.findAll({
        where: { isDone: true },
        attributes: ['userId', [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration']],
        group: ['userId'],
        order: [[sequelize.fn('SUM', sequelize.col('duration')), 'DESC']],
        limit: 10,
        include: [{
          model: User,
          attributes: ['name', 'avatar']
        }],
        raw: true,
        nest: true
      }),
      // pagination and search
      Teacher_info.findAndCountAll({
        include: [{
          model: User,
          attributes: ['id', 'name', 'avatar', 'country', 'description']
        }],
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('User.name')), 'LIKE', `%${keyword.toLowerCase()}%`
            ),
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('User.country')), 'LIKE', `%${keyword.toLowerCase()}%`
            )
          ]
        },
        limit,
        offset,
        nest: true,
        raw: true,
      })
    ])
      .then(([topLearnUsers, teachers]) => {
        if (teachers.rows.length === 0) {
          throw new Error(`${keyword}沒有結果`)
        }
        const data = topLearnUsers.map(u => ({
          ...u,
          totalDuration: Number(u.totalDuration) / 60,
          rank: topLearnUsers.indexOf(u) + 1
        }))
        return cb(null, {
          teachers: teachers.rows,
          keyword,
          pagination: getPagination(limit, page, teachers.count),
          topLearnUsers: data
        })
      })
      .catch(err => cb(err))
  },
  getNewTeacher: (req, cb) => {
    const WEEK = { 1: "星期一", 2: "星期二", 3: "星期三", 4: "星期四", 5: "星期五", 6: "星期六", 7: "星期日" }
    return cb(null, { WEEK })
  },
  postTeacher: (req, cb) => {
    const { method, classLink, weekDay } = req.body
    const startTime = dayjs(req.body.startTime, "HH:mm:ss")
    const endTime = dayjs(req.body.endTime, "HH:mm:ss")
    const duration = dayjs(req.body.duration, "HH:mm:ss")
    const timeDifference = endTime.diff(startTime, 'minute') - duration.diff(dayjs("00:00:00", "HH:mm:ss"), "minute")
    if (timeDifference < 0) throw new Error('開始時間、結束時間與課程時間設定有誤')
    if (!method || !classLink || !weekDay || !startTime || !endTime || !duration) throw new Error('All infomation needed！')
    return Teacher_info.create({
      method,
      classLink,
      weekDay: JSON.stringify(weekDay),
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
      duration: duration.format("HH:mm"),
      userId: req.user.id
    })
      .then(teacher => {
        req.flash('success_messages', '恭喜成為老師!')
        return cb(null, teacher)
      })
      .catch(err => cb(err))
  },
  myProfile: (req, cb) => {
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
        order: [["date", 'DESC']],
        raw: true
      })
    ])
      .then(([teacher, courses]) => {
        if (!teacher) throw new Error("Teacher didn't exist!")
        // 將整理後時間傳到樣板
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
        return cb(null, { teacher, courses: data })
      })
      .catch(err => cb(err))
  },
  getTeacher: (req, cb) => {
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
        if (!teacher) throw new Error("Teacher didn't exist!")
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
        // loop兩周中有空的時間
        for (let i = 0; i < 14; i++) {
          const date = today.add(i, "day")
          const dateFormat = date.format("YYYY-MM-DD")
          // 判斷weekDay陣列中有無包括date的星期 沒有則date+1
          if (weekDay.includes(date.get("day"))) {
            for (let j = 0; j < solts; j++) {
              const start = sTime.add(j * duration, "minute")
              const startTime = start.format("HH:mm:ss")
              const endTime = start.add(duration, "minute").format("HH:mm")
              // 判斷*目前*時間是否在已預約清單 否則push
              if (!bookedCourses.includes(`${dateFormat}-${startTime}`)) {
                schedule.push({
                  date: dateFormat,
                  startTime: removeSeconds(startTime),
                  weekDay: dayjs(date).format('ddd'),
                  endTime,
                  duration
                })
              }
            }
          }
        }
        return cb(null, { teacher, courses, schedule })
      })
      .catch(err => cb(err))
  },
  editPage: (req, cb) => {
    const data = req.user
    data.Teacher_info.startTime = removeSeconds(data.Teacher_info.startTime)
    data.Teacher_info.endTime = removeSeconds(data.Teacher_info.endTime)
    data.Teacher_info.duration = toMinutes(data.Teacher_info.duration)
    const WEEK = { 1: "星期一", 2: "星期二", 3: "星期三", 4: "星期四", 5: "星期五", 6: "星期六", 7: "星期日" }
    return cb(null, { user: data, WEEK })
  },
  putTeacher: (req, cb) => {
    const teacherId = req.params.id
    const { file } = req
    const { name, country, method, classLink, weekDay, description } = req.body
    const startTime = dayjs(req.body.startTime, "HH:mm:ss")
    const endTime = dayjs(req.body.endTime, "HH:mm:ss")
    const duration = dayjs(req.body.duration, "HH:mm:ss")
    const timeDifference = endTime.diff(startTime, 'minute') - duration.diff(dayjs("00:00:00", "HH:mm:ss"), "minute")
    if (!name || !country || !method) throw new Error('Name and Country and Method they are required')
    if (timeDifference < 0) throw new Error('開始時間、結束時間與課程時間設定有誤')
    return Teacher_info.findByPk(teacherId)
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
          imgurFileHandler(file),
        ])
      })
      .then(([user, filePath]) => {
        return user.update({
          name,
          country: country.toLowerCase(),
          description,
          avatar: filePath || user.avatar
        })
      })
      .then(user => {
        req.flash('success_messages', 'Info was successfully to update')
        return cb(null, { user, teacherId })
      })
      .catch(err => cb(err))
  },
  postReserve: (req, cb) => {
    const teacherId = req.params.id
    const { bookDate } = req.body
    const formatDate = bookDate.split(" ")
    const date = dayjs(formatDate[0], "YYYY-MM-DD")
    const startTime = dayjs(formatDate[1], "HH:mm")
    const endTime = dayjs(formatDate[2], "HH:mm")
    const duration = Number(formatDate[3])
    const user = req.user
    // 判斷是否有選擇日期
    if (!dayjs(date).isValid()) throw new Error('請選擇日期！')
    return Teacher_info.findByPk(teacherId, { raw: true })
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
          duration,
          teacherInfoId: teacher.id
        })
      })
      .then(course => {
        return cb(null, course)
      })
      .catch(err => cb(err))
  },
  putScore: (req, cb) => {
    const { rate, message } = req.body
    const CourseId = req.params.id
    const userId = req.user.id
    if (rate > 5 || rate < 1) throw new Error('分數請在1~5之間，可小數1位')
    return Course.findByPk(CourseId)
      .then(course => {
        return course.update({
          rate: Number(rate),
          message
        })
      })
      .then(score => {
        req.flash('success_messages', 'Score was successfully to update')
        return cb(null, { score, userId })
      })
      .catch(err => cb(err))
  }
}

module.exports = teacherServices