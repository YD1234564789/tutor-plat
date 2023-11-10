const { User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const adminController = {
  signInPage: (req, res, next) => {
    res.render('admin/signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_messages', 'Admin成功登入!')
    return res.redirect('/admin/users')
  },
  getUsers: (req, res, next) => {
    const DEFAULT_LIMIT = 15
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return User.findAndCountAll({
      raw: true,
      limit,
      offset
    })
      .then(users => {
        return res.render('admin/users', {
          users: users.rows,
          pagination: getPagination(limit, page, users.count)
        })
      })
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