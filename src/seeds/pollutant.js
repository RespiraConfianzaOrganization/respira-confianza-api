module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Pollutants', [
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Pollutants', null, {});
  }
}