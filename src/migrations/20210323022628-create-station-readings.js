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
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Stations',
          },
          key: 'id'
        },
      },
      // Ambiental factors
      TEMP: {
        type: Sequelize.INTEGER
      },
      PRESS: {
        type: Sequelize.INTEGER
      },
      HR: {
        type: Sequelize.INTEGER
      },
      // Pollutants
      // MP10
      MP10: {
        type: Sequelize.FLOAT
      },
      // MP25
      MP25: {
        type: Sequelize.FLOAT
      },
      // SO2
      SO2: {
        type: Sequelize.FLOAT
      },
      // O3
      O3: {
        type: Sequelize.FLOAT
      },
      // NO2
      NO2: {
        type: Sequelize.FLOAT
      },
      // NO
      NO: {
        type: Sequelize.FLOAT
      },
      // CO2
      CO2: {
        type: Sequelize.FLOAT
      },
      // CO
      CO: {
        type: Sequelize.FLOAT
      },
      // COV
      COV: {
        type: Sequelize.FLOAT
      },
      // Extras
      extra1: {
        type: Sequelize.FLOAT
      },
      extra2: {
        type: Sequelize.FLOAT
      },
      extra3: {
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