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
        if (county.fips.length === 4 && +county.fips) {
          county.fips = '0' + county.fips; //add 0 to 4-digit fips codes
        }
        return { countyName: county.county_name, fips: county.fips };
      });
      stateFipsMap[key] = counties;
    });

    //exceptions
    stateFipsMap['Puerto Rico'] = [
      { countyName: 'Puerto Rico', fips: 'pr' }
    ];
    stateFipsMap['New York'].push({ countyName: 'New York City', fips: 'nyc' });
    stateFipsMap['Missouri'].push({ countyName: 'Kansas City', fips: 'kc' });
    stateFipsMap['District of Columbia'].pop(); //remove duplicate from D.C.

    const json = JSON.stringify(stateFipsMap);
    fs.writeFileSync('../data/state_fips_dict.json', json);
  })

