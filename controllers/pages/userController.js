const userServices = require('../../services/user-services')

// userServices.getTeachers(req, (err, data) => err ? next(err) : res.render('teachers', data))
const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!!')
    res.redirect('/home')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, err=> err ? next(err) : res.redirect('/signIn'))
  },
  logout: (req, res) => {
    req.logout(err => {
      if (err) { return next(err) }
      req.flash('success_messages', '登出成功!')
      res.redirect('/signIn')
    })
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.render('users/profile', data))
  },
  getEdit: (req, res, next) => {
    userServices.getEdit(req, (err, data) => err ? next(err) : res.render('users/edit', data))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => err ? next(err) : res.redirect(`/users/${data.userId}`))
  }
}

module.exports = userController