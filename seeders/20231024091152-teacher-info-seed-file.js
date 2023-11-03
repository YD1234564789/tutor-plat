'use strict';
const { faker } = require('@faker-js/faker')
const { User } = require('../models')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
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
      // 將陣列轉字串才能存入sql
      const week_day = JSON.stringify(faker.helpers.arrayElements([0, 1, 2, 3, 4, 5, 6]))
      const start_time = dayjs(faker.helpers.arrayElement(["18:00" ,"19:00" ,"20:00"]), "HH:mm").format("HH:mm")
      const end_time = dayjs(faker.helpers.arrayElement(["21:00", "22:00"]), "HH:mm").format("HH:mm")
      const duration = dayjs(faker.helpers.arrayElement(["00:30", "01:00"]), "HH:mm").format("HH:mm")
      return {
        method,
        class_link,
        week_day,
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