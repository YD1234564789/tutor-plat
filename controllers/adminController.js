const { User } = require('../models')

const adminController = {
  signInPage: (req, res, next) => {
    res.render('admin/signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_messages', 'Admin成功登入!')
    res.redirect('/admin/users')
  },
  logout: (req, res, next) => {

  },
  getUsers: (req, res, next) => {
    User.findAll({
      raw: true
    })
      .then(users => res.render('admin/users', {users}))
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('admin/user', { user })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController