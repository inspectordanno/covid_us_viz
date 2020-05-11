import { mean } from 'd3-array';
import fipsExceptions from './fipsExceptions';

export const getCountyFips = (fips) => {
  const boroughs = new Set([
    "36061", // New York (Manhattan)
    "36047", //Kings (Brooklyn)
    "36005", //Bronx
    "36085", //Staten Island
    "36081" //Queens
  ]);

  //custom fips codes for nyc and puerto rico
  if (boroughs.has(fips)) {
    return fipsExceptions.nyc;
  } else if (fips.substring(0, 2) === "72") {
    return fipsExceptions.pr;
  } else {
    return fips;
  }
};

export const getFrequency = (countyData, dateIndex, fips, measure) => { 
  const fipsData = countyData.get(dateIndex).get(fips);
  if (fipsData) {
    return fipsData[0][measure]; //for some reason data object is nested in an array
  } else {
    return 0; //return 0 if no data exists
  }
};

export const threeDayAverage = (countyData, dateIndex, fips, measure) => {

  const getFreq = (customIndex) => {
    return getFrequency(countyData, customIndex, fips, measure);
  }

  const lastIndex = countyData.size - 1;

  if (dateIndex === 0) { //if first day, get average of first three days
    return mean([getFreq(0), getFreq(1), getFreq(2)]);
  } else if (dateIndex === lastIndex) { //if last day, get average of last three days
    return mean([getFreq(lastIndex), getFreq(lastIndex - 1), getFreq(lastIndex - 2)]);
  } else { //get average of yesterday, current day, and tomorrow
    return mean([getFreq(dateIndex - 1), getFreq(dateIndex), getFreq(dateIndex + 1)]);
  }
}
