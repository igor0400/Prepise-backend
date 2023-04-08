'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      return queryInterface.createTable('TEST_QUESTIONS_REPLIES_FILES', {
         id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
         },
         testQuestionReplyId: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         url: {
            type: Sequelize.STRING(1000),
            allowNull: false,
         },
         name: {
            type: Sequelize.STRING(1000),
            allowNull: false,
         },
      });
   },

   async down(queryInterface) {
      return queryInterface.dropTable('TEST_QUESTIONS_REPLIES_FILES');
   },
};
