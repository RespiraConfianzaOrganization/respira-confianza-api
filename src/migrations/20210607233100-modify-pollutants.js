'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Pollutants', 'extendedName',
      {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'X'
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Pollutants', 'extendedName');
  }
};