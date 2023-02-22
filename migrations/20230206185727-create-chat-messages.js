'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      return queryInterface.createTable('CHAT_MESSAGES', {
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
         authorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         value: {
            type: Sequelize.STRING(1000),
            allowNull: false,
         },
         type: {
            type: Sequelize.ENUM('default', 'system'),
            defaultValue: 'default',
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
      return queryInterface.dropTable('CHAT_MESSAGES');
   },
};
