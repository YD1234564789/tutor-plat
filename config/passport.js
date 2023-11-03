const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20')
const bcrypt = require('bcryptjs')
const { User, Teacher_info } = require('../models')

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
        return cb(null, user)
        })
      })
  }
))
 // google登入
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  profileFields: ['email', 'displayName']
  },
  (accessToken, refreshToken, profile, cb) => {
    const { email, name } = profile._json
    User.findOne({ where: { email }})
      .then(user => {
        if(user) return cb(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => cb(null, user))
          .catch(err => cb(err, false))
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
// 登入一起帶上老師身分
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: Teacher_info
  }).then(user => {
    // console.log("usertojson", user.toJSON())
    return cb(null, user.toJSON())
  })
})

module.exports = passport