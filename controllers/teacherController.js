const { Teacher_info, User, Course } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')
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
    // 登入的user已帶入teacher身分，沒有則null
    res.render('teachers/edit', { user: req.user })
  },
  putTeacher: (req, res, next) => {
    const { file } = req
    const { name, country, method, classLink, weekDay, description } = req.body
    const startTime = Number(req.body.startTime)
    const endTime = Number(req.body.endTime)
    const duration = Number(req.body.duration)/60
    const timeDifference = endTime - startTime - duration
    if (!name || !country || !method) throw new Error('Name and Country and Method they are required')
    if (timeDifference <0) throw new Error('開始時間、結束時間與課程時間設定有誤')
    console.log('time', timeDifference)
      return Teacher_info.findByPk(req.params.id)
      .then(teacher => {
        if (!teacher) throw new Error("Teacher didn't exist")
        return teacher.update({
          method,
          classLink,
          weekDay: JSON.stringify(weekDay),
          startTime,
          endTime,
          duration
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