const { Teacher_info, User, Course } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')
const { removeSeconds, getTimeInMinutes } = require('../helpers/removeSeconds-helpers')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const teacherController = {
  getNewTeacher: (req, res, next) => {

  },
  postTeacher: (req, res, next) => {

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
        return res.render('teachers/profile', { teacher, courses: data })
      })
      .catch(err => next(err))
  },
  editPage: (req, res) => {
    const data = req.user
    data.Teacher_info.startTime = removeSeconds(data.Teacher_info.startTime)
    data.Teacher_info.endTime = removeSeconds(data.Teacher_info.endTime)
    data.Teacher_info.duration = getTimeInMinutes(data.Teacher_info.duration)
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

  },
  putScore: (req, res, next) => {

  }
}

module.exports = teacherController