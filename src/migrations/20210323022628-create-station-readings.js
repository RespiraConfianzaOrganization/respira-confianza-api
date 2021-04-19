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
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Stations',
          },
          key: 'id'
        },
      },
      Temperatura: {
        type: Sequelize.FLOAT
      },
      Presion: {
        type: Sequelize.FLOAT
      },
      Humedad: {
        type: Sequelize.FLOAT
      },
      MP10: {
        type: Sequelize.FLOAT
      },
      MP25: {
        type: Sequelize.FLOAT
      },
      MP1: {
        type: Sequelize.FLOAT
      },
      SO2: {
        type: Sequelize.FLOAT
      },
      O3: {
        type: Sequelize.FLOAT
      },
      NO2: {
        type: Sequelize.FLOAT
      },
      NO: {
        type: Sequelize.FLOAT
      },
      CO2: {
        type: Sequelize.FLOAT
      },
      CO: {
        type: Sequelize.FLOAT
      },
      COV: {
        type: Sequelize.FLOAT
      },
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