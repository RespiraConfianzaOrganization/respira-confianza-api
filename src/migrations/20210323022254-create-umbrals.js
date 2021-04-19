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
      pollutant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Pollutants',
          },
          key: 'id'
        },
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
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Umbrals');
  }
};