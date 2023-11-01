const { Teacher_info, User, Course } = require('../models')
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
        // 整理時間資料傳回樣板 例:20.5>20:30
        const data = courses.map(c => {
          const sHour = Math.floor(c.startTime).toString().padStart(2, '0')
          const sMinute = Math.round((c.startTime - sHour) * 60).toString().padStart(2, '0')
          const eHour = Math.floor(c.endTime).toString().padStart(2, '0')
          const eMinute = Math.round((c.endTime - eHour) * 60).toString().padStart(2, '0')
          const date = c.date.toISOString().split('T')[0]
          return {
            ...c,
            startTime: date + "  " + sHour + ":" + sMinute,
            endTime: date + "  " + eHour + ":" + eMinute
          }
        })
        return res.render('teachers/profile', { teacher, courses: data })
      })
      .catch(err => next(err))
  },
  editPage: (req, res, next) => {
    Teacher_info.findByPk(req.params.id, {
      include: User,
      nest: true,
      raw: true
    })
      .then(teacher => {
        if (!teacher) throw new Error("teacher didn't exist!")
        res.render('teachers/edit', { teacher })
      })
      .catch(err => next(err))
  },
  putTeacher: (req, res, next) => {

  },
  postReserve: (req, res, next) => {

  },
  putScore: (req, res, next) => {

  }
}

module.exports = teacherController