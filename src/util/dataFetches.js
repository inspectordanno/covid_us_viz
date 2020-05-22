import { csv } from 'd3-fetch';
import { group, groups } from 'd3-array';

import countyDict from '../data/county_dict.json';
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
const createGroupedMap = (oldEntriesMap) => {
  //creating new map which will be returned at the end
  const groupedMap = new Map();

  oldEntriesMap.forEach((municipalityData, municipality) => {

    //data which will contain previous data, plus newCases and newDeaths
    const newData = [];

    municipalityData.forEach((d, i) => {
      const newCases = calculateNew(d, i, municipalityData, 'totalCases');
      const newDeaths = calculateNew(d, i, municipalityData, 'totalDeaths');
      const newEntry = {
        ...d,
        newCases,
        newDeaths,
      };
      //push the new entry to the newData array
      newData.push(newEntry);
    });

    //set the current municipality (key) to the newData array (value)
    groupedMap.set(municipality, newData);
  });

  //return the final grouped map
  return groupedMap;
}

export const fetchCountryNyt = async () => {
  try {
    const url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv';
    const countryRes = await csv(url, d => {
      //renaming and removing old keys
      const entry = {
      ...d,
      totalCases: +d.cases,
      totalDeaths: +d.deaths
    };
      const { cases, deaths, ...formatted } = entry;
      return formatted;
    });

    const withNew = countryRes.map((d, i) => {
      const newCases = calculateNew(d, i, countryRes, 'totalCases');
      const newDeaths = calculateNew(d, i, countryRes, 'totalDeaths');
      return {
        ...d,
        newCases,
        newDeaths,
      };
    });

    return withNew;
    
  } catch (e) {
    console.error(e);
  }
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

    return createGroupedMap(groupByState);

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

    const haveFips = countyRes.filter(d => d.fips);
    const groupByFips = group(haveFips, d => d.fips);

    return createGroupedMap(groupByFips);

  } catch (e) {
    console.error(e);
  }
}


