import { csv, json } from 'd3-fetch';
import moment from 'moment';
import { group, groups } from 'd3-array';

import countyDict from '../../dist/data/county_dict.json';

//groups data by date and formats date
const groupData = (dataRes) => {
  const groupedByDate = group(dataRes, d => d.date); //returns es6 map

  //es6 map
  //sets new formatted key with value
  const grouped = new Map();
  groupedByDate.forEach((value, key) => {
    grouped.set(key, value)
  });
  return grouped;
}

export const fetchStateNyt = async () => {
  try {
    const url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv';
    const stateRes = await csv(url);
    return groupData(stateRes);
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
    return groupData(countyRes);
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


