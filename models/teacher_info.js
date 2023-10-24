'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher_info = sequelize.define('Teacher_info', {
    method: DataTypes.STRING,
    classLink: DataTypes.STRING,
    date: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    duration: DataTypes.STRING
  }, {
    underscored: true,
  });
  Teacher_info.associate = function(models) {
    Teacher_info.belongsTo(models.User, { foreignKey: 'userId' })
  };
  return Teacher_info;
};