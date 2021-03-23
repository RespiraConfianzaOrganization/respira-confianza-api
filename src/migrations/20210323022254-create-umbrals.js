'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Umbrals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sensor_type_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      good: {
        type: Sequelize.FLOAT
      },
      moderate: {
        type: Sequelize.FLOAT
      },
      unhealthy: {
        type: Sequelize.FLOAT
      },
      very_unhealthy: {
        type: Sequelize.FLOAT
      },
      dangerous: {
        type: Sequelize.FLOAT
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Umbrals');
  }
};