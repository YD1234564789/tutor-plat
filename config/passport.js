const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// set up passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
  usernameField: 'email',
  passportField: 'password',
  passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email }})
      .then(user => {
        if(!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))
        bcrypt.compare(password, user.password).then(res => {
        if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))
        return cb(null, user.toJSON())
        })
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    return cb(null, user)
  })
})

module.exports = passport