const models = require('../models');
const { Op } = require("sequelize");

const getCities = async (req, res) => {
  const { search } = req.query
  let cities;
  if (search) {
    cities = await models.City.findAll({
      where: {
        name: {
          [Op.iLike]: '%' + search + '%',
        }
      }
    });
  }
  else {
    cities = await models.City.findAll({});
  }
  return res.status(200).json({ cities })
};

const getCitiesByCountry = async (req, res) => {
  const { country_id } = req.params
  const cities = await models.City.findAll({
    where: { country_id }
  });
  return res.status(200).json({ cities })
}

module.exports = {
  getCities,
  getCitiesByCountry
}