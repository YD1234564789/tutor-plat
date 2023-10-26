'use strict';
module.exports = (sequelize, DataTypes) => {
  const Couse = sequelize.define('Course', {
    startTime: DataTypes.INTEGER,
    endTime: DataTypes.INTEGER,
    date: DataTypes.DATE,
    rate: DataTypes.INTEGER,
    isDone: DataTypes.BOOLEAN,
    message: DataTypes.TEXT
  }, {
    underscored: true,
  });
  Couse.associate = function(models) {
    // associations can be defined here
  };
  return Couse;
};