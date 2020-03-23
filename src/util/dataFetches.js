import { json } from 'd3-fetch';
import moment from 'moment';
import { groups } from 'd3-array';

export const fetchNationalData = async () => {
  try {
    const res = await json('https://covidtracking.com/api/us/daily');
    //formats date into moment object
    return res.map((entry) => {
      return {
        ...entry,
        date: moment(entry.date, 'YYYYMMDD')
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
          date: moment(entry[0], 'YYYYMMDD'),
          data: entry[1]
        }
      });
      return dateFormatted;
    } catch (e) {
      console.error(e);
    }
  }

  //fetch u.s. county data
  export const fetchCountyData = async () => {
    try {
      // get location metadata
      const locationsMetadata = await json('https://coronadatascraper.com/locations.json');
      const countyMetadata = locationsMetadata.filter(d => d.county && d.country === 'USA'); //only keeping U.S. counties
      const metaDataDict = {}; //object where is key is countyKey, object is county metadata
      countyMetadata.forEach(d => {
        metaDataDict[d.featureId] = d; //creates a countyKey for each county's metadata
      });

      const timeSeriesRes = await json('https://coronadatascraper.com/timeseries.json');

      //looping over date objects
      const timeSeriesData = Object.entries(timeSeriesRes).map(entry => {
        const date = entry[0]; //date of date object
        const dateData = entry[1]; //data for each date object being looped over
        //new data object which will be returned
        const newDateObject = {
          date: moment(date, 'YYYY-M-DD'),
          data: []
        } 
        
        Object.keys(metaDataDict).forEach(countyKey => { 
          //loop through county keys
          //if key is in county meta data dictionary, return new object
          if (dateData[countyKey]) {
              newDateObject.data.push(
                { countyData: dateData[countyKey], countyMetadata: metaDataDict[countyKey] }
              );
          }
        });
        return newDateObject;
      });
      //only return dates that have data associated with them
      return timeSeriesData.filter(d => d.data.length !== 0);
    } catch (e) {
      console.error(e);
    }
  }



