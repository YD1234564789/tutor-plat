const { Teacher_info, User, Course, sequelize } = require('../../models')
const { imgurFileHandler } = require('../../helpers/file-helper')
const { removeSeconds, toMinutes } = require('../../helpers/formatTime-helpers')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')
const { Op } = require('sequelize')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const teacherServices = require('../../services/teacher-services')

// teacherServices.getTeachers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
const teacherController = {
  getTeachers: (req, res, next) => {
    teacherServices.getTeachers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  teacherSearch: (req, res, next) => {
    teacherServices.teacherSearch(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getNewTeacher: (req, res, next) => {
    teacherServices.getNewTeacher(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTeacher: (req, res, next) => {
    teacherServices.postTeacher(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  myProfile: (req, res, next) => {
    teacherServices.myProfile(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getTeacher: (req, res, next) => {
    teacherServices.getTeacher(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  editPage: (req, res) => {
    teacherServices.editPage(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putTeacher: (req, res, next) => {
    const { file } = req
    const { name, country, method, classLink, weekDay, description } = req.body
    const startTime = dayjs(req.body.startTime, "HH:mm:ss")
    const endTime = dayjs(req.body.endTime, "HH:mm:ss")
    const duration = dayjs(req.body.duration, "HH:mm:ss")
    const timeDifference = endTime.diff(startTime, 'minute') - duration.diff(dayjs("00:00:00", "HH:mm:ss"), "minute")
    if (!name || !country || !method) throw new Error('Name and Country and Method they are required')
    if (timeDifference < 0) throw new Error('開始時間、結束時間與課程時間設定有誤')
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
          country: country.toLowerCase(),
          description,
          avatar: filePath || user.avatar
        })
      })
      .then(() => {
        req.flash('success_messages', 'Info was successfully to update')
        res.redirect(`/teachers/${req.params.id}/myProfile`)
      })
      .catch(err => next(err))
  },
  postReserve: (req, res, next) => {
    const { bookDate } = req.body
    const formatDate = bookDate.split(" ")
    const date = dayjs(formatDate[0], "YYYY-MM-DD")
    const startTime = dayjs(formatDate[1], "HH:mm")
    const endTime = dayjs(formatDate[2], "HH:mm")
    const duration = Number(formatDate[3])
    const user = req.user

    if (!dayjs(date).isValid()) throw new Error('請選擇日期！')
    return Teacher_info.findByPk(req.params.id, { raw: true })
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
      .catch(err => next(err))
  },
  putScore: (req, res, next) => {
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
      .then(() => {
        req.flash('success_messages', 'Score was successfully to update')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = teacherController