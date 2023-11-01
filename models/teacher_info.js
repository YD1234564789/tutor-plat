'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher_info = sequelize.define('Teacher_info', {
    method: DataTypes.STRING,
    classLink: DataTypes.STRING,
    weekDay: DataTypes.STRING,
    startTime: DataTypes.FLOAT,
    endTime: DataTypes.FLOAT,
    duration: DataTypes.FLOAT
  }, {
    underscored: true,
  });
  Teacher_info.associate = function(models) {
    Teacher_info.belongsTo(models.User, {
      foreignKey: 'userId' })
    Teacher_info.hasMany(models.Course, {
      foreignKey: 'teacherInfoId'
    })
  };
  return Teacher_info;
};