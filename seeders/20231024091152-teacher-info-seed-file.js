'use strict';
const { faker } = require('@faker-js/faker')
const { User } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({
      order: [['id', 'ASC']],
      limit: 27,
      raw: true
    })

    // 決定teacherInfo的資料
    const teacherInfoData = users.map(user => {
      const method = faker.helpers.arrayElement(['Online','In-Person'])
      const class_link = faker.internet.url()
      const date = [JSON.stringify(faker.helpers.arrayElements(['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']))]
      const start_time = parseInt(faker.helpers.arrayElement([18, 19, 20]))
      const end_time = parseInt(faker.helpers.arrayElement([21, 22]))
      const duration = parseInt(faker.helpers.arrayElement([30, 60]))
      return {
        method,
        class_link,
        week_day: date,
        start_time,
        end_time,
        duration,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: user.id
      }
    })
    await queryInterface.bulkInsert('Teacher_infos', teacherInfoData)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Teacher_infos', {})
  }
}