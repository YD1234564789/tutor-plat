const teacherServices = require('../../services/teacher-services')

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
    teacherServices.putScore(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = teacherController