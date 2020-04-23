import { csv } from 'd3-fetch';
import { group, groups } from 'd3-array';

import countyDict from '../../dist/data/county_dict.json';
import fipsExceptions from '../util/fipsExceptions';

//this function calculates the number of new cases/deaths for each place
//d is datum, is index of datum in values array, measure is either "totalCases" or "totalDeaths"
const calculateNew = (d, i, arr, measure) => {
  if (i === 0) {
    //if the first entry for the location, new cases are simply the number of cases
    return d[measure];
  } else {
    //current day's figure minus previous day's figure
    const differenceFromPrevious = d[measure] - arr[i - 1][measure];
    //if there are more or the same, return new cases/deaths
    if (Math.sign(differenceFromPrevious) !== -1) {
      return differenceFromPrevious;
      //if there are less cases/deaths than the day before, return 0 new cases/deaths
    } else if (Math.sign(differenceFromPrevious) === -1) {
      return 0;
    }
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

    return groups(newEntriesArray, d => d.date); //returns es6 map
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

      //return custom coordinates and fips code
      const returnCoordinates = (coordinates, fipsException ) => {
        return {
          ...formatted,
          fips: fipsException,
          coordinates
        }
      }
  
      //localities with no fips code but are included in data
      if (d.county === 'New York City') {
        return returnCoordinates([-74.006, 40.713], fipsExceptions.nyc);
      } else if (d.county === 'Kansas City' && d.state === 'Missouri') {
        return returnCoordinates([-94.579, 39.100], fipsExceptions.kc)
      } else if (d.state === 'Puerto Rico') {
        return returnCoordinates([-66.430, 18.222], fipsExceptions.pr);
      } 
      else  {
        return formatted;
      }
    });

    //filter by cases that have coordinates (this ignores "unknown counties" - change this?)
    const coords = countyRes.filter(d => d.coordinates); 
    const noFips = coords.filter(d => !d.fips);
    //console.log(noFips);

    const groupByPlace = group(coords, d => d.coordinates);
    const newEntriesArray = [];
    createNewEntriesArray(newEntriesArray, groupByPlace);

    return groups(newEntriesArray, d => d.date); //returns es6 map
  } catch (e) {
    console.error(e);
  }
}


