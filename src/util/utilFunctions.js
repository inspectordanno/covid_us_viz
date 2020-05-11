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

export const threeDayAverage = (dateIndex, fips, measure) => {
  const yesterday = getFrequency(countyData.get(dateIndex - 1), fips, measure);
  const today = getFrequency(countyData.get(dateIndex), fips, measure);
  const tomorrow = getFrequency(countyData.get(dateIndex + 1), fips, measure);

  if (!yesterday) {
    return mean([today, tomorrow, getFrequency(countyData.get(dateIndex + 2), fips, measure)]);
  } else if (!tomorrow) {
    return mean([today, yesterday, getFrequency(countyData.get(dateIndex - 2), fips, measure)]);
  } else {
    return mean([yesterday, today, tomorrow]);
  }
}
