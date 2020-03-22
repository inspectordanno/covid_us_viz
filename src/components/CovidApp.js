import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setDay } from '../actions/actions';
import { fetchNationalData, fetchStateData, fetchCountyData } from '../util/dataFetches';
import USMap from './USMap';
import TimeSlider from './TimeSlider';

const CovidApp = () => {

  const [nationalData, setNationalData] = useState();
  const [stateData, setStateData] = useState();
  const [countyData, setCountyData] = useState();
  const dispatch = useDispatch();

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const nationalDataRes = await fetchNationalData();
        const stateDataRes = await fetchStateData();
        const countyDataRes = await fetchCountyData();
        setNationalData(nationalDataRes);
        setStateData(stateDataRes);
        setCountyData(countyDataRes);
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  //when national data is populated, gets first day and sends it to store
  useEffect(() => {
    if (nationalData) {
      const firstDay = nationalData[0].date.dayOfYear();
      dispatch((setDay(firstDay)));
    }
  }, [nationalData])

  //store selectors
  const day = useSelector(state => state.day);

  return nationalData && stateData && day
  ?
  (
    <div className="CovidApp">
      <USMap nationalData={nationalData} stateData={stateData} day={day} />
      <TimeSlider nationalData={nationalData} />
    </div>
  )
  :
  null;
}

export default CovidApp;