import { csv, json } from 'd3-fetch';
import moment from 'moment';
import { groups } from 'd3-array';

import countyDict from '../../dist/data/county_dict.json';

export const fetchCountyNyt = async () => {
  const url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv';
  try {
    const countyRes = await csv(url, (d) => {
      const formatted = {
        ...d,
        date: moment(d.date, 'YYYY-MM-DD').dayOfYear(),
        cases: +d.cases,
        deaths: +d.deaths,
        coordinates: countyDict[d.fips]
      };

      const returnCoordinates = (coords) => {
        return {
          ...formatted,
          coordinates: coords
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
    return countyRes;
  } catch (e) {
    console.error(e);
  }
}

export const fetchStateNyt = async () => {
  try {
    const url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv';
    const stateRes = await csv(url);
    const groupedByDate = groups(stateRes, d => d.date);
    const dateFormatted = groupedByDate.map(entry => {
      return {
        date: moment(entry[0], 'YYYYMMDD').dayOfYear(),
        data: entry[1]
      }
    });
    return dateFormatted;
  } catch (e) {
    console.error(e);
  }
}

export const fetchNationalData = async () => {
  try {
    const res = await json('https://covidtracking.com/api/us/daily');
    //formats date into moment object
    return res.map((entry) => {
      return {
        ...entry,
        date: moment(entry.date, 'YYYYMMDD').dayOfYear()
      }
    });
  } catch (e) {
    console.error(e);
  }
}


