'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    date: DataTypes.DATE,
    rate: DataTypes.FLOAT,
    isDone: DataTypes.BOOLEAN,
    message: DataTypes.TEXT,
    duration: DataTypes.FLOAT
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