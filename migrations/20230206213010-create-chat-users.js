'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      return queryInterface.createTable('CHAT_USERS', {
         id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
         },
         chatId: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
      });
   },

   async down(queryInterface) {
      return queryInterface.dropTable('CHAT_USERS');
   },
};
