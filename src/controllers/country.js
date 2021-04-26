const models = require('../models');

const getCoutries = async (req, res) => {
  const countries = await models.Country.findAll({});
  return res.status(200).json({ countries })
};

module.exports = {
  getCoutries
}