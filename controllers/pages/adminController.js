const adminServices = require('../../services/admin-services')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Admin成功登入!')
    return res.redirect('/admin/users')
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.render('admin/users', data))
  },
  getUser: (req, res, next) => {
    adminServices.getUser(req, (err, data) => err ? next(err) : res.render('admin/user', data))
  }
}

module.exports = adminController