import { csv, json } from 'd3-fetch';
import { group } from 'd3-array';
import moment from 'moment';

import countyDict from '../../dist/data/county_dict.json';

//this function calculates the number of new cases/deaths for each place
//d is datum, is index of datum in values array, measure is either "totalCases" or "totalDeaths"
const calculateNew = (d, i, arr, measure) => {
  if (i === 0) {
    //if the first entry for the location, new cases are simply the number of cases
    return d[measure];
  } else {
    //current day's cases minus yesterday's cases
    return d[measure] - arr[i - 1][measure];
  }
}

//add newCases and newDeaths and push to a new array
const createNewEntriesArray = (newEntriesArray, oldEntriesMap) => {
  oldEntriesMap.forEach((value, key) => {
    value.forEach((d, i) => {
      const newCases = calculateNew(d, i, value, 'totalCases');
      const newDeaths = calculateNew(d, i, value, 'totalDeaths');
      const newEntry = {
        ...d,
        newCases,
        newDeaths,
      };
      newEntriesArray.push(newEntry);
    });
  });
}


export const fetchStateNyt = async () => {
  try {
    const url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv';
    const stateRes = await csv(url, d => {
      //renaming and removing old keys
      const entry = {
        ...d,
        totalCases: +d.cases,
        totalDeaths: +d.deaths
      };
      const { cases, deaths, ...formatted } = entry;
      return formatted;
    });
    const groupByState = group(stateRes, d => d.state);
    const newEntriesArray = [];
    createNewEntriesArray(newEntriesArray, groupByState);

    return group(newEntriesArray, d => d.date); //returns es6 map
  } catch (e) {
    console.error(e);
  }
}

export const fetchCountyNyt = async () => {
  const url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv';
  try {
    const countyRes = await csv(url, d => {
      //renaming and removing old keys, adding coordinates
      const entry = {
        ...d,
        totalCases: +d.cases,
        totalDeaths: +d.deaths,
        coordinates: countyDict[d.fips]
      };
      const { cases, deaths, ...formatted } = entry;

      //return custom coordinates
      const returnCoordinates = (coordinates) => {
        return {
          ...formatted,
          coordinates
        }
      }

      if (d.county === 'New York City') {
        returnCoordinates([74.006, 40.713]);
      } else if (d.county === 'Kansas City' && d.state === 'Missouri') {
        returnCoordinates([94.579, 39.100])
      } else if (d.state === 'Rhode Island' && !d.fips) {
        returnCoordinates([71.477, 41.580]);
      } else if (d.state === 'Puerto Rico') {
        returnCoordinates([66.430, 18.222]);
      } 
      else  {
        return formatted;
      }
    });

    //filter by cases that have coordinates (this ignores "unknown counties" - change this?)
    const coords = countyRes.filter(d => d.coordinates); 

    const groupByPlace = group(coords, d => d.coordinates);
    const newEntriesArray = [];
    createNewEntriesArray(newEntriesArray, groupByPlace);

    return group(newEntriesArray, d => d.date); //returns es6 map
  } catch (e) {
    console.error(e);
  }
}


