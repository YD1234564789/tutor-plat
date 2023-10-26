'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher_info = sequelize.define('Teacher_info', {
    method: DataTypes.STRING,
    classLink: DataTypes.STRING,
    weekDay: DataTypes.STRING,
    startTime: DataTypes.INTEGER,
    endTime: DataTypes.INTEGER,
    duration: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Teacher_info.associate = function(models) {
    Teacher_info.belongsTo(models.User, { foreignKey: 'userId' })
  };
  return Teacher_info;
};