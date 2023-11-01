'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    description: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    totalLearningTime: DataTypes.FLOAT,
    isAdmin: DataTypes.BOOLEAN,
    country: DataTypes.STRING
  }, {
    underscored: true
  });
  User.associate = function(models) {
    User.hasOne(models.Teacher_info, { foreignKey: 'userId' })
    User.hasMany(models.Course, { foreignKey: 'userId'})
  };
  return User;
};