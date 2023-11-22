const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../../helpers/file-helper')
const { User, Course, Teacher_info } = require('../../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (error) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signIn')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.logout(err => {
      if (err) { return next(err) }
      req.flash('success_messages', '登出成功!')
      res.redirect('/signIn')
    })
  },
  getUser: (req, res, next) => {
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
        // console.log('history', JSON.stringify(history, null, 2))
        if (!user) { throw new Error("User didn't exist~") }
        return res.render('users/profile', { user, newCourses, history })
      })
      .catch(err => next(err))
  },
  getEdit: (req, res, next) => {
    User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
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