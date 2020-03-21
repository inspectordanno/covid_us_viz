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
  export const fetchUsStateData = async () => {
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



