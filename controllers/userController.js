const bcrypt = require('bcryptjs')
const { User } = require('../models')
const userController = {
  signInPage: (req, res) =>{
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/home')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')
    User.findOne({ where: { email: req.body.email }})
      .then(user => {
        if(user) throw new Error('Email already exists')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    res.logout
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {

  },
  getEdit: (req, res, next) => {

  },
  putUser: (req, res, next) => {

  }
}

module.exports = userController