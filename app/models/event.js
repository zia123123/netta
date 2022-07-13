
'use strict';

module.exports = (sequelize, DataTypes) => {

  const event = sequelize.define('event', {
    codeEvent: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    status:{
      type: DataTypes.BOOLEAN,
    },
  }, {
    tableName: "events"
  });

  event.associate = function(models) {
    event.hasMany(models.attendance,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "event"})
    event.hasMany(models.checkin,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "event"})

  };

  return event;
};