import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';

import USMap from './USMap';
import TimeSlider from './TimeSlider';

const CovidApp = () => {

  const [nationalData, setNationalData] = useState();

  //fetches national data
  useEffect(() => {
    const fetchNationalData = async () => {
      try {
        const res = await axios.get('https://covidtracking.com/api/us/daily');
        const formattedDates = res.data.map((entry) => {
          return {
            ...entry,
            date: moment(entry.date, 'YYYYMMDD')
          }
        });
        setNationalData(formattedDates);
      } catch (e) {
        console.error(e);
      }
    }
    fetchNationalData();
  }, [])

  return nationalData ?
  (
    <div className="CovidApp">
      <USMap />
      <TimeSlider nationalData={nationalData} />
    </div>
  )
  :
  null;
}

export default CovidApp;