const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../../helpers/file-helper')
const { User, Course, Teacher_info } = require('../../models')
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
    const { name, country, description } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          country: country.toLowerCase(),
          description,
          avatar: filePath || user.avatar
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController