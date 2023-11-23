const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helper')
const { User, Course, Teacher_info } = require('../models')


const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      })
      .then(user => {
        req.flash('success_messages', '成功註冊帳號!')
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        raw: true
      }),
      Course.findAll({
        where: {
          userId: req.params.id,
          isDone: "0"
        },
        include: Teacher_info,
        limit: 2,
        order: [["date", "DESC"]],
        raw: true,
        nest: true
      }),
      Course.findAll({
        where: {
          userId: req.params.id,
          isDone: "1"
        },
        include: {
          model: Teacher_info,
          include: User,
        },
        nest: true,
        order: [["rate", "ASC"]],
        raw: true
      })
    ])
      .then(([user, newCourses, history]) => {
        if (!user) { throw new Error("User didn't exist~") }
        return cb(null, { user, newCourses, history })
      })
      .catch(err => cb(err))
  },
  getEdit: (req, cb) => {
    User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const userId = req.params.id
    const { name, country, description } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    Promise.all([
      User.findByPk(userId),
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
      .then(data => {
        req.flash('success_messages', '使用者資料編輯成功')
        return cb(null, { data, userId })
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices