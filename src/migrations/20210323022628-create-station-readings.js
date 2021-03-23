'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Station_Readings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      station_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      contaminant_1: {
        type: Sequelize.FLOAT
      },
      contaminant_2: {
        type: Sequelize.FLOAT
      },
      contaminant_3: {
        type: Sequelize.FLOAT
      },
      contaminant_4: {
        type: Sequelize.FLOAT
      },
      contaminant_5: {
        type: Sequelize.FLOAT
      },
      contaminant_6: {
        type: Sequelize.FLOAT
      },
      recorded_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Station_Readings');
  }
};