'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      return queryInterface.createTable('CHATS', {
         id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
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
      return queryInterface.dropTable('CHATS');
   },
};
