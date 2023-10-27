const { Teacher_info, User } = require('../models')
const teacherController = {
  getNewTeacher: (req, res, next) => {

  },
  postTeacher: (req, res, next) => {

  },
  getTeacher: (req, res, next) => {
    return Teacher_info.findByPk(req.params.id, {
      include: User,
      nest: true,
      raw: true
    })
      .then(teacher => {
        if (!teacher) throw new Error("Teacher diidn't exist!")
        res.render('teachers/profile', { teacher })
      })
      .catch(err => next(err))
  },
  editPage: (req, res, next) => {

  },
  putTeacher: (req, res, next) => {

  },
  postReserve: (req, res, next) => {

  },
  putScore: (req, res, next) => {

  }
}

module.exports = teacherController