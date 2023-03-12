'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      return queryInterface.createTable('BLOCKS', {
         id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
         },
         authorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         title: {
            type: Sequelize.STRING(100),
            allowNull: false,
         },
         description: Sequelize.STRING(100),
         type: {
            type: Sequelize.ENUM('default', 'test'),
            allowNull: false,
         },
         commented: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
         },
         section: {
            type: Sequelize.STRING(100),
            allowNull: false,
         },
         content: {
            type: Sequelize.TEXT,
            allowNull: false,
         },
         likes: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
         },
         dislikes: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
         },
         viewes: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
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
      return queryInterface.dropTable('BLOCKS');
   },
};
