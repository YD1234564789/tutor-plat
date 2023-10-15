'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher_info = sequelize.define('Teacher_info', {
    method: DataTypes.STRING,
    classLink: DataTypes.STRING,
    date: DataTypes.DATE,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    duration: DataTypes.STRING
  }, {
    underscored: true,
  });
  Teacher_info.associate = function(models) {
    // associations can be defined here
  };
  return Teacher_info;
};