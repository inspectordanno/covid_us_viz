const csv = require('csvtojson');
const { group } = require('d3-array');
const fs = require('fs');
const alphabetize = require('alphabetize-object-keys');
const fipsExceptions = require('../util/fipsExceptions');

// csv()
//   .fromFile('../data/county_fips_master.csv')
//   .then(jsonObj => {
//     const grouped = group(jsonObj, d => d.state_name);
//     const stateFipsMap = {};
//     grouped.forEach((value, key) => {
//       const counties = value.map(county => { 
//         if (county.fips.length === 4 && +county.fips) {
//           county.fips = '0' + county.fips; //add 0 to 4-digit fips codes
//         }
//         return { countyName: county.county_name, fips: county.fips };
//       });
//       stateFipsMap[key] = counties;
//     });

//     const addException = (name, fips) => {
//       stateFipsMap[name] = [
//         { countyName: name, fips }
//       ];
//     }

//     addException('Puerto Rico', fipsExceptions.pr);
//     addException('Guam', fipsExceptions.guam);
//     addException('Virgin Islands', fipsExceptions.vi);
//     addException('Northern Mariana Islands', fipsExceptions.nmi);

//     stateFipsMap['New York'].push({ countyName: 'New York City', fips: fipsExceptions.nyc });
//     stateFipsMap['Missouri'].push({ countyName: 'Kansas City', fips: fipsExceptions.kc });
//     stateFipsMap['District of Columbia'].pop(); //remove duplicate from D.C.

//     const sorted = alphabetize(stateFipsMap);
//     const json = JSON.stringify(sorted);
//     fs.writeFileSync('../data/state_fips_dict.json', json);
//   })

const file = fs.readFileSync('../data/pop_est_2019.json');
const obj = JSON.parse(file);
console.log(obj)
const newObj = {};

for (const [key, value] of Object.entries(obj)) {
  newObj[key] = value.population;
}

const json = JSON.stringify(newObj);
fs.writeFileSync('../data/est_pop_2019.json', json);

