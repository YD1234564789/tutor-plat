const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

// 一般用戶與老師通過
const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req))
    if (!getUser(req).isAdmin) return next()
    req.flash('error_messages', 'Admin帳戶請到專門頁面！')
    res.redirect('/admin/signIn')
}
// 老師身分通過，否則到一般用戶首頁
const authenticatedTeacher = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).Teacher_info) return next()
    res.redirect('/teachers')
  }
  res.redirect('/signIn')
}
// 是admin則通過，否則回一般登入頁
const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req) && getUser(req).isAdmin) return next()
  req.flash('error_messages', '此帳號不具有管理者權限！')
  res.redirect('/signIn')
}

module.exports = {
  authenticated,
  authenticatedTeacher,
  authenticatedAdmin
}