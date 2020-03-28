import { csv, json } from 'd3-fetch';
import moment from 'moment';
import { groups } from 'd3-array';

import countyDict from '../../dist/data/county_dict.json';

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

//fetches u.s. state data; groups by date and makes the date a moment object
  export const fetchStateData = async () => {
    try {
      const res = await json('https://covidtracking.com/api/states/daily');
      const groupedByDate = groups(res, d => d.date);
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

  // get location metadata
  const fetchCountyMetadata = async () => {
     try {
      let locationsMetadata = await json('https://coronadatascraper.com/locations.json');
      locationsMetadata.forEach((d,i) => d.locationKey = i);
      const countyMetadata = locationsMetadata.filter(d => d.county && d.country === 'USA'); //only keeping U.S. counties
      return countyMetadata;
     } catch (e) {
       console.error(e);
     } 
  }

  //fetch u.s. county data
  export const fetchCountyData = async () => {
    try {
      const countyMetadata = await fetchCountyMetadata();
      const timeSeriesRes = await json('https://coronadatascraper.com/timeseries.json');

      //looping over date objects
      const timeSeriesData = Object.entries(timeSeriesRes).map(entry => {
        const date = entry[0]; //date of date object
        const dateData = entry[1]; //data for each date object being looped over
        //new data object which will be returned
        const newDateObject = {
          date: moment(date, 'YYYY-M-DD').dayOfYear(),
          data: []
        } 
        countyMetadata.forEach(d => { 
          //loop through county keys
          //if key is in county meta data dictionary, return new object
          if (dateData[d.locationKey]) {
              newDateObject.data.push(
                { countyData: dateData[d.locationKey], countyMetadata: d }
              );
          }
        })
        return newDateObject;
      })
      .filter(d => d.data.length !== 0) //only return dates that have data associated with them
      return timeSeriesData;
    } catch (e) {
      console.error(e);
    }
  }

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
        } else if (d.state === 'Rhode Island') {
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



