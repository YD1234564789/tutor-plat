const teacherServices = require('../../services/teacher-services')

const teacherController = {
  getTeachers: (req, res, next) => {
    teacherServices.getTeachers(req, (err, data) => err ? next(err) : res.render('teachers', data))
  },
  teacherSearch: (req, res, next) => {
    teacherServices.teacherSearch(req, (err, data) => err ? next(err) : res.render('teachers', data))
  },
  getNewTeacher: (req, res, next) => {
    teacherServices.getNewTeacher(req, (err, data) => err ? next(err) : res.render('teachers/apply', data))
  },
  postTeacher: (req, res, next) => {
    teacherServices.postTeacher(req, (err, data) => err ? next(err) : res.redirect(`/teachers/${data.id}/myProfile`))
  },
  myProfile: (req, res, next) => {
    teacherServices.myProfile(req, (err, data) => err ? next(err) : res.render('teachers/myProfile', data))
  },
  getTeacher: (req, res, next) => {
    teacherServices.getTeacher(req, (err, data) => err ? next(err) : res.render('teachers/teacherProfile', data))
  },
  editPage: (req, res) => {
    teacherServices.editPage(req, (err, data) => err ? next(err) : res.render('teachers/edit', data))
  },
  putTeacher: (req, res, next) => {
    teacherServices.putTeacher(req, (err, data) => err ? next(err) : res.redirect(`/teachers/${data.teacherId}/myProfile`))
  },
  postReserve: (req, res, next) => {
    teacherServices.postReserve(req, err => {if (err) next(err)})
  },
  putScore: (req, res, next) => {
    teacherServices.putScore(req, (err, data) => err ? next(err) : res.redirect(`/users/${data.userId}`))
  }
}

module.exports = teacherController