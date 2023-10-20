'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      description: "I'm admin",
      avatar: 'https://loremflickr.com/320/240/restaurant,food/?lock=120',
      total_learning_time: '0',
      is_admin: true,
      country: 'TW',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
