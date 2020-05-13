import { mean } from "d3-array";
import fipsExceptions from "./fipsExceptions";
import { parse, add, sub, format, isBefore } from "date-fns";

export const getCountyFips = (fips) => {
  const boroughs = new Set([
    "36061", // New York (Manhattan)
    "36047", //Kings (Brooklyn)
    "36005", //Bronx
    "36085", //Staten Island
    "36081", //Queens
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
  const fipsData = countyData.get(dateIndex).data.get(fips);
  if (fipsData) {
    return fipsData[0][measure]; //for some reason data object is nested in an array
  } else {
    return 0; //return 0 if no data exists
  }
};

export const threeDayAverage = (countyData, dateIndex, fips, measure) => {
  const getFreq = (customIndex) => {
    return getFrequency(countyData, customIndex, fips, measure);
  };

  const lastIndex = countyData.size - 1;

  if (dateIndex === 0) {
    //if first day, get average of first three days
    return mean([getFreq(0), getFreq(1), getFreq(2)]);
  } else if (dateIndex === lastIndex) {
    //if last day, get average of last three days
    return mean([
      getFreq(lastIndex),
      getFreq(lastIndex - 1),
      getFreq(lastIndex - 2),
    ]);
  } else {
    //get average of yesterday, current day, and tomorrow
    return mean([
      getFreq(dateIndex - 1),
      getFreq(dateIndex),
      getFreq(dateIndex + 1),
    ]);
  }
};

const dateToken = 'yyyy-MM-dd';

//returns Date object
const parseDate = (countyData, dateIndex) => {
  return parse(countyData.get(dateIndex).date, dateToken, new Date());
}

// @param timePeriod is how long to compare now vs. previous (e.x. 1 month, 2 weeks, etc.)
export const percentChange = (countyData, dateIndex, dateMap, fips, measure, timePeriod) => {
  const nowfreq = getFrequency(countyData, dateIndex, fips, measure);
  const nowParsed = parseDate(countyData, dateIndex);
  const prev = format(sub(nowParsed, timePeriod), dateToken);
  const prevFreq = getFrequency(countyData, dateMap[prev], fips, measure);
  const percentChange = (nowfreq - prevFreq) / prevFreq;
  return percentChange;
};

export const doPercentChange = (countyData, dateIndex, dateMap, fips, measure, timePeriod, dispatchDateIndex) => {
  const firstDate = parseDate(countyData, 0);
  const timePeriodFromFirstDate = add(firstDate, timePeriod);
  const currentDate = parseDate(countyData, dateIndex);
  
  //if the current date is before the time period from the first date, update the date index to be
  //the time period from the first date, otherwise calculate percent change
  //e.x. if we want to compare percent change between a date and a month previous, we can only compare
  //dates that have month-previous counterparts
  //if they do not, we have to update the date to the first date that has a month previous counterpart,
  //which is the time period from the first date
  if (isBefore(currentDate, timePeriodFromFirstDate)) {
    const formatted = format(timePeriodFromFirstDate, dateToken); //formatting to yyyy-MM-dd date
    dispatchDateIndex(dateMap[formatted]); //looking up date index and and dispatching to store
  } else {
    return percentChange(countyData, dateIndex, dateMap, fips, measure, timePeriod);
  }
}
