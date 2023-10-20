'use strict';
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
      const userPromises = Array.from({ length: 32}, async (_, i) => {
        const hashPassword = await bcrypt.hash('12345678', 10)
        return {
          name: faker.person.fullName(),
          email: `user${i}@example.com`,
          password: hashPassword,
          description: faker.person.bio(),
          avatar: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
          total_learning_time: '0',
          is_admin: false,
          country: faker.location.countryCode(),
          created_at: new Date(),
          updated_at: new Date()
        }
      })
      const users = await Promise.all(userPromises)
      await queryInterface.bulkInsert('Users', users)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
