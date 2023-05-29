'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      return queryInterface.createTable('INTERVIEWES', {
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
         title: {
            type: Sequelize.STRING(50),
            allowNull: false,
         },
         date: {
            type: Sequelize.STRING(50),
            allowNull: false,
         },
         remindDate: {
            type: Sequelize.STRING(50),
            allowNull: false,
         },
         position: {
            type: Sequelize.STRING(100),
            allowNull: false,
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
      return queryInterface.dropTable('INTERVIEWES');
   },
};
