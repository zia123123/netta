'use strict';

module.exports = (sequelize, DataTypes) => {

  const checkin = sequelize.define('checkin', {
    name: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: "checkins"
  });

  checkin.associate = function(models) {
    checkin.belongsTo(models.event,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "eventId"})
  };

  return checkin;
};