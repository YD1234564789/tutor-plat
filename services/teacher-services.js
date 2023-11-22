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
  },
  teacherSearch: (req, cb) => {
    const keyword = req.query.keyword.trim()
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      // TOP10 learnTime user
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
      // pagination and search
      Teacher_info.findAndCountAll({
        include: [{
          model: User,
          attributes: ['id', 'name', 'avatar', 'country', 'description']
        }],
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('User.name')), 'LIKE', `%${keyword.toLowerCase()}%`
            ),
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('User.country')), 'LIKE', `%${keyword.toLowerCase()}%`
            )
          ]
        },
        limit,
        offset,
        nest: true,
        raw: true,
      })
    ])
      .then(([topLearnUsers, teachers]) => {
        if (teachers.rows.length === 0) {
          throw new Error(`${keyword}沒有結果`)
        }
        const data = topLearnUsers.map(u => ({
          ...u,
          totalDuration: Number(u.totalDuration) / 60,
          rank: topLearnUsers.indexOf(u) + 1
        }))
        return cb(null, {
          teachers: teachers.rows,
          keyword,
          pagination: getPagination(limit, page, teachers.count),
          topLearnUsers: data
        })
      })
      .catch(err => cb(err))
  },
  getNewTeacher: (req, cb) => {
    const WEEK = { 1: "星期一", 2: "星期二", 3: "星期三", 4: "星期四", 5: "星期五", 6: "星期六", 7: "星期日" }
    return cb(null, { WEEK })
  },
  postTeacher: (req, cb) => {
    const { method, classLink, weekDay } = req.body
    const startTime = dayjs(req.body.startTime, "HH:mm:ss")
    const endTime = dayjs(req.body.endTime, "HH:mm:ss")
    const duration = dayjs(req.body.duration, "HH:mm:ss")
    const timeDifference = endTime.diff(startTime, 'minute') - duration.diff(dayjs("00:00:00", "HH:mm:ss"), "minute")
    if (timeDifference < 0) throw new Error('開始時間、結束時間與課程時間設定有誤')
    if (!method || !classLink || !weekDay || !startTime || !endTime || !duration) throw new Error('All infomation needed！')
    return Teacher_info.create({
      method,
      classLink,
      weekDay: JSON.stringify(weekDay),
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
      duration: duration.format("HH:mm"),
      userId: req.user.id
    })
      .then(user => {
        return user
      })
      .catch(err => cb(err))
  },
}

module.exports = teacherServices