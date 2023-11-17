const { Teacher_info, User, Course, sequelize } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')
const { removeSeconds, toMinutes } = require('../helpers/formatTime-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { Op } = require('sequelize')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const teacherServices = {
  getTeachers: (req, cb) => {
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Course.findAll({
        where: { isDone: true },
        attributes: ['userId', [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration']],
        group: ['userId'],
        order: [[sequelize.fn('SUM', sequelize.col('duration')), 'DESC']],
        limit: 10,
        include: [{
          model: User,
          attributes: ['name', 'avatar']
        }],
        raw: true,
        nest: true
      }),
      Teacher_info.findAndCountAll({
        include: User,
        limit,
        offset,
        nest: true,
        raw: true,
      })
    ])
      .then(([topLearnUsers, teachers]) => {
        const data = topLearnUsers.map((u, index) => {
          const learnHour = Number(u.totalDuration) / 60
          return {
            ...u,
            totalDuration: learnHour,
            rank: index + 1
          }
        })
        return cb(null, {
          teachers: teachers.rows,
          pagination: getPagination(limit, page, teachers.count),
          topLearnUsers: data
        })
      })
      .catch(err => cb(err))
  }
}

module.exports = teacherServices