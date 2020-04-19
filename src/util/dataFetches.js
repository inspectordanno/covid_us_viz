import { csv, json } from 'd3-fetch';
import { group } from 'd3-array';
import moment from 'moment';

import countyDict from '../../dist/data/county_dict.json';

export const fetchStateNyt = async () => {
  try {
    const url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv';
    const stateRes = await csv(url);
    return group(stateRes, d => d.date); //returns es6 map
  } catch (e) {
    console.error(e);
  }
}

export const fetchCountyNyt = async () => {
  const url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv';
  try {
    const countyRes = await csv(url, d => {
      const formatted = {
        ...d,
        cases: +d.cases,
        deaths: +d.deaths,
        coordinates: countyDict[d.fips]
      };

      //return custom coordinates
      const returnCoordinates = (coordinates) => {
        return {
          ...formatted,
          coordinates
        }
      }

      if (d.county === 'New York City') {
        returnCoordinates([74.006, 40.713]);
      } else if (d.state === 'Rhode Island' && !d.fips) {
        returnCoordinates([71.477, 41.580]);
      } else if (d.county === 'Do√±a Ana') {
        returnCoordinates(countyDict['35013']);
      } else  {
        return formatted;
      }
    });
    // countyRes.forEach(())
    return group(countyRes, d => d.date); //returns es6 map
  } catch (e) {
    console.error(e);
  }
}

export const fetchNationalData = async () => {
  try {
    const nationalRes = await json('https://covidtracking.com/api/us/daily');
    //formats date into moment object
    return nationalRes.map((entry) => {
      return {
        ...entry,
        date: moment(entry.date, 'YYYYMMDD').dayOfYear()
      }
    });
  } catch (e) {
    console.error(e);
  }
}


