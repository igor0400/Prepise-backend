'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('NOTIFI_SETTINGS', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      settingsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      all: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      messages: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      testReplies: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      newSubs: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('NOTIFI_SETTINGS');
  },
};
