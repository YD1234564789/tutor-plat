'use strict';
module.exports = (sequelize, DataTypes) => {
  const Couse = sequelize.define('Couse', {
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    date: DataTypes.DATE,
    rate: DataTypes.STRING,
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