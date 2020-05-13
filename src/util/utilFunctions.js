import { mean } from "d3-array";
import fipsExceptions from "./fipsExceptions";
import { parse, subMonths, format } from "date-fns";

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
const parseDate = (dateIndex) => {
  return parse(countyData.get(dateIndex).date, dateToken, new Date());
}

export const percentChange = (countyData, dateIndex, fips, measure) => {
  const nowfreq = getFrequency(countyData, dateIndex, fips, measure);
  const nowParsed = parseDate(dateToken);
  const prev = format(subMonths(nowParsed, 1), dateToken); //1 month previous
  const getPrevFreq = () => {
    for (const [value, key] of countyData.entries()) {
      if (value.date === prev) {
        return getFrequency(countyData, key, fips, measure);
      }
    }
  };
  const prevFreq = getPrevFreq();
  console.log(prevFreq);
  const percentChange = (nowfreq - prevFreq) / prevFreq;
  return percentChange;
};

export const doPercentChange = (countyData, dateIndex, dispatch) => {
  const firstDate = parse(countyData.get(dateIndex).date, date
}
