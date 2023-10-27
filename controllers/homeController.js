const { Teacher_info, User } = require('../models')

const homeController = {
  getHome: (req, res, next) => {
    return Teacher_info.findAll({
      include: User,
      nest: true,
      raw: true
    }).then(teachers => {
      return res.render('home', {teachers})
    })
  },
  search: (req, res, next) => {

  },
}

module.exports = homeController