'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      return queryInterface.createTable('DATA_SECTIONS', {
         id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
         },
         title: {
            type: Sequelize.STRING(100),
            allowNull: false,
         },
         createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
      });
   },

   async down(queryInterface) {
      return queryInterface.dropTable('DATA_SECTIONS');
   },
};
