
const homeController = {
  getHome: (req, res) => {
    const teacher = req.user.Teacher_info || null
    if (teacher) {
      req.flash('success_messages', '老師成功登入!')
      res.redirect(`/teachers/${teacher.id}/myProfile`)
    } else {
      req.flash('success_messages', '學生成功登入!')
      res.redirect('/teachers')
    }
  }
}

module.exports = homeController