import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import intersection from 'lodash/intersection';
import { min } from 'd3-array';

import { setDay } from '../actions/actions';
import { fetchNationalData, fetchStateData, fetchCountyData, fetchCountyNyt, fetchStateNyt } from '../util/dataFetches';
import USMap from './USMap';
import TimeSlider from './TimeSlider';

const CovidApp = () => {

  const [nationalData, setNationalData] = useState();
  const [stateData, setStateData] = useState();
  const [countyData, setCountyData] = useState();
  const [days, setDays] = useState();
  const dispatch = useDispatch();

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const nationalDataRes = await fetchNationalData();
        const stateDataRes = await fetchStateData();
        const countyDataRes = await fetchCountyData();
        const countyNytRes = await fetchCountyNyt();
        const stateNytRes = await fetchStateNyt();
        console.log(countyNytRes);
        console.log(stateNytRes);
        setNationalData(nationalDataRes);
        setStateData(stateDataRes);
        setCountyData(countyDataRes);
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  //get days in common amongst data
  useEffect(() => {
    if (stateData && countyData) {
      //gets numeric days
      const getDays = (municipalData) => {
        return municipalData.map(entry => {
          const day = entry.date;
          return day;
        });
      }

      //find intersection of arrays so there are no gaps between state and county data
      const daysInCommon = intersection(getDays(stateData), getDays(countyData));
      
      //get first day
      const firstDay = min(daysInCommon);
      
      //set current day to first day
      dispatch((setDay(firstDay)));

      //set days 
      setDays(daysInCommon);
    }
  }, [stateData, countyData])

  //store selectors
  const day = useSelector(state => state.day);

  return nationalData && stateData && countyData && days && day
  ?
  (
    <div className="CovidApp">
      <TimeSlider days={days} />
      <USMap nationalData={nationalData} stateData={stateData} countyData={countyData} day={day} />
    </div>
  )
  :
  null;
}

export default CovidApp;