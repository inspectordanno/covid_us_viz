const csv = require('csvtojson');
const { group } = require('d3-array');
const fs = require('fs');

csv()
  .fromFile('../data/county_fips_master.csv')
  .then(jsonObj => {
    const grouped = group(jsonObj, d => d.state_name);
    const stateFipsMap = {};
    grouped.forEach((value, key) => {
      const counties = value.map(county => { 
        return { countyName: county.county_name, fips: county.fips }
      });
      stateFipsMap[key] = counties;
    });
    const json = JSON.stringify(stateFipsMap);
    fs.writeFileSync('../data/state_fips_dict.json', json);
  })
