const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { User } = require('../models')


const adminServices = {
  getUsers: (req, cb) => {
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
        return cb(null, {
          users: users.rows,
          pagination: getPagination(limit, page, users.count)
        })
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    const userId = req.params.id
    return User.findByPk(userId, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return cb(null, { user })
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices