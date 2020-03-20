import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { fetchNationalData, fetchUsStateData } from '../util/dataFetches';
import USMap from './USMap';
import TimeSlider from './TimeSlider';

const CovidApp = () => {

  const [nationalData, setNationalData] = useState();
  const [UsStateData, setUsStateData] = useState();

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const nationalDataRes = await fetchNationalData();
        const stateDataRes = await fetchUsStateData();
        setNationalData(nationalDataRes);
        setUsStateData(stateDataRes);
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  //store selectors
  const day = useSelector(state => state.day);

  return nationalData && UsStateData 
  ?
  (
    <div className="CovidApp">
      <USMap nationalData={nationalData} UsStateData={UsStateData} day={day} />
      <TimeSlider nationalData={nationalData} />
    </div>
  )
  :
  null;
}

export default CovidApp;