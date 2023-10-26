'use strict';

module.exports = {
  up:  (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Couses', 'user_id', {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          }
        }, { transaction: t }),
        queryInterface.addColumn('Couses', 'teacher_info_id', {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Teacher_infos',
            key: 'id'
          }
        }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Couses', 'user_id', { transaction: t }),
        queryInterface.removeColumn('Couses', 'teacher_info_id', { transaction: t })
      ])
    })
  }
};
