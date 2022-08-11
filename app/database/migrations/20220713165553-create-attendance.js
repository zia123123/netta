'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      notelp: {
        type: Sequelize.STRING
      },
      qrcode: {
        uniqe: true,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      eventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "events",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attendances');
  }
};