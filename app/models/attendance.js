'use strict';

module.exports = (sequelize, DataTypes) => {

  const attendance = sequelize.define('attendance', {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    notelp: {
      type: DataTypes.STRING,
    },
    qrcode:{
      type: DataTypes.STRING,
    },
    status:{
      type: DataTypes.BOOLEAN,
    },
  }, {
    tableName: "attendances"
  });

  attendance.associate = function(models) {
    attendance.belongsTo(models.event,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "eventId"})
  };

  return attendance;
};