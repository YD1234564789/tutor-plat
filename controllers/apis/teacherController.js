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
    teacherServices.putTeacher(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postReserve: (req, res, next) => {
    teacherServices.postReserve(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
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