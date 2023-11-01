'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    startTime: DataTypes.FLOAT,
    endTime: DataTypes.FLOAT,
    date: DataTypes.DATE,
    rate: DataTypes.FLOAT,
    isDone: DataTypes.BOOLEAN,
    message: DataTypes.TEXT
  }, {
    underscored: true,
  });
  Course.associate = function(models) {
    Course.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    Course.belongsTo(models.Teacher_info, {
      foreignKey: 'teacherInfoId'
    })
  };
  return Course;
};