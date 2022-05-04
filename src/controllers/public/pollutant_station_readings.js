const models = require("../../models");
const sequelize = require("sequelize");

const groupByStations = ({ stationsList, stationsModelList }) => {
    const groupedByStation = {}
    stationsList.forEach(station => {
        groupedByStation[station] = stationsModelList.filter(({station_id}) => {
            const actual = station.toLowerCase()
            const expected = station_id.toLowerCase()
            return actual === expected
        })
    })
    return groupedByStation
}

const makeQuery = (startDate, endDate, stations, fields) => {
    const stringFields = fields.map(f => `AVG("${f}") AS ${f}`)
    const joinedFields = stringFields.join(',')
    const tupleStations = `(${stations.map(s => `'${s}'`).toString()})`
    const query = `
    SELECT station_id,
           make_timestamp(CAST(DATE_PART('year', recorded_at) as integer),
                          CAST(DATE_PART('month', recorded_at) as integer),
                          CAST(DATE_PART('day', recorded_at) as integer),
                          CAST(DATE_PART('hour', recorded_at) as integer),
                          0,
                          0
           ) as TIMESTAMP,
           ${joinedFields}
    FROM "Station_Readings"
    WHERE recorded_at BETWEEN '${startDate}' AND '${endDate}'
          AND station_id IN ${tupleStations}
    GROUP BY station_id,
             DATE_PART('day', recorded_at),
             DATE_PART('hour', recorded_at),
             DATE_PART('year', recorded_at),
             DATE_PART('month', recorded_at)
    `

    return query
}

const pollutantsReadingsByStations = async (req, res) => {

    const { pollutants, stations, startDate, endDate } = req.body;

    const query = makeQuery(startDate, endDate, stations, pollutants)

    const stationsObjects = await models.sequelize.query(query, {
        raw: true,
        type: sequelize.QueryTypes.SELECT,
    });

    const groupedByStation = groupByStations({
        stationsList: stations,
        stationsModelList: stationsObjects
    })

    return res.status(200).json({ readings: groupedByStation });
}


module.exports = {
    pollutantsByStations: pollutantsReadingsByStations
}
