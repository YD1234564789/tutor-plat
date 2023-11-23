const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../../helpers/file-helper')
const { User, Course, Teacher_info } = require('../../models')
const userServices = require('../../services/user-services')

// userServices.getTeachers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
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
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getEdit: (req, res, next) => {
    userServices.getEdit(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = userController