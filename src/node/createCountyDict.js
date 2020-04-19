const csv = require('csvtojson');
const fs = require('fs');

const csvPath = '../../dist/data/us_county_centroids.csv';

csv()
  .fromFile(csvPath)
  .then(jsonObj => {
    return jsonObj.map(entry => {
      //get last five numbers
      const fips = entry.GEO_ID.substring(entry.GEO_ID.length - 5);
      return {
        fips,
        coordinates: [+entry.EASTING, +entry.NORTHING]
      }
    })
  }).then(res => {
    const countyDict = {};

    res.forEach(entry => {
      countyDict[entry.fips] = entry.coordinates;
    });

    const jsonDict = JSON.stringify(countyDict);
    console.log(jsonDict);
    fs.writeFileSync('../../dist/data/county_dict.json', jsonDict);
  })



