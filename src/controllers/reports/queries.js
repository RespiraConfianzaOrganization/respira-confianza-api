import models from "../../models";

export const getUmbralsByPollutant = async (pollutant) => {
    return await models.Umbrals.findOne({
        where: {pollutant},
        include: {
            model: models.Pollutant
        }
    })
}
