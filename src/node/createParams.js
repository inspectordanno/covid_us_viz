const fs = require('fs');

const file = fs.readFileSync('../data/name_fips_pop.json');
const json = JSON.parse(file);

const statesLowercased = {};
const countiesLowercased = {};

Object.entries(json).forEach(([key, value]) => {
  console.log(key);

  const statesFormatted = key.replace(/ /g,'').toLowerCase();

  value.forEach((county) => {
    const countyName = county.countyName.replace(/ /g,'').toLowerCase();
    countiesLowercased[countyName] = county;
  });


  statesLowercased[statesFormatted] = key;
})  

fs.writeFileSync('../data/states_lower_case.json', JSON.stringify(statesLowercased));
fs.writeFileSync('../data/counties_lower_case.json', JSON.stringify(countiesLowercased));



