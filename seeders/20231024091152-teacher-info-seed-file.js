'use strict';
const { faker } = require('@faker-js/faker')
const { User } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先撈出 99>id>73 的user作為老師
    const users = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.and]: [
            { [Sequelize.Op.gt]: 73 },
            { [Sequelize.Op.lt]: 99 }
          ]
        }
      }
    },
    { raw: true })

    // 決定teacherInfo的資料
    const teacherInfoData = users.map(user => {
      const method = faker.helpers.arrayElement(['Online','In-Person'])
      const class_link = faker.internet.url()
      const date = JSON.stringify(faker.helpers.arrayElements(['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']))
      const start_time = faker.helpers.arrayElement(['18', '19', '20'])
      const end_time = faker.helpers.arrayElement(['21', '22'])
      const duration = faker.helpers.arrayElement(['30', '60'])
      return {
        method,
        class_link,
        date,
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
};

// id73~99