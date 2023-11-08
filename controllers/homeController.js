const { Teacher_info, User } = require('../models')

const homeController = {
  getHome: (req, res, next) => {
    const teacher = req.user.Teacher_info || null
    if (teacher) {
      req.flash('success_messages', '老師成功登入!')
      res.redirect(`teachers/${teacher.id}/myProfile`)
    }
    req.flash('success_messages', '學生成功登入!')
    res.redirect('/teachers')
  },
  search: (req, res, next) => {

  },
}

module.exports = homeController