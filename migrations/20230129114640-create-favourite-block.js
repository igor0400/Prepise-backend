'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('FAVOURITE_BLOCKS', {
       id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          unique: true,
          primaryKey: true,
       },
       userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
       },
       itemId: {
          type: Sequelize.INTEGER,
          allowNull: false,
       },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('FAVOURITE_BLOCKS');
  },
};
