const csv = require('csvtojson');
const { group } = require('d3-array');
const fs = require('fs');
const alphabetize = require('alphabetize-object-keys');
const fipsExceptions = require('../util/fipsExceptions');

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

    const addException = (name, fips) => {
      stateFipsMap[name] = [
        { countyName: name, fips }
      ];
    }

    addException('Puerto Rico', fipsExceptions.pr);
    addException('Guam', fipsExceptions.guam);
    addException('Virgin Islands', fipsExceptions.vi);
    addException('Northern Mariana Islands', fipsExceptions.nmi);

    stateFipsMap['New York'].push({ countyName: 'New York City', fips: fipsExceptions.nyc });
    stateFipsMap['Missouri'].push({ countyName: 'Kansas City', fips: fipsExceptions.kc });
    stateFipsMap['District of Columbia'].pop(); //remove duplicate from D.C.

    const sorted = alphabetize(stateFipsMap);
    const json = JSON.stringify(sorted);
    fs.writeFileSync('../data/state_fips_dict.json', json);
  });

  const makePopFile = () => {
    const fipsPop = {
      nyc: 8336817,
      kc: 495327,
      pr: 3193694,
      guam: 167294,
      vi: 107000,
      nmi: 51994
    }

    const file = fs.readFileSync('../data/est_pop_2019.json');
    const json = JSON.parse(file);
    const obj = { ...json, ...fipsPop };
    fs.writeFileSync('../data/pop_2019.json', JSON.stringify(obj));
  }

  makePopFile();

  const combineFipsAndPop = () => {
    const fipsDict = JSON.parse(fs.readFileSync('../data/state_fips_dict.json'));
    const popDict = JSON.parse(fs.readFileSync('../data/pop_2019.json'));
    const newObj = {};
    for (const [key, value] of Object.entries(fipsDict)) {
      const fipsArr = value.map(entry => ({ ...entry, pop_2019: popDict[entry.fips] }));
      newObj[key] = fipsArr;
    }
    const json = JSON.stringify(newObj);
    console.log(json);
    fs.writeFileSync('../data/name_fips_pop.json', json);

  }

  combineFipsAndPop();


  




