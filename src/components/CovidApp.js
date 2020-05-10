import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { timeout } from 'd3-timer';

import { fetchStateNyt, fetchCountyNyt } from '../util/dataFetches';
import { dispatchDateIndex } from '../actions/actions';
import UsMap from './UsMap';
import DataPoints from './DataPoints';

const CovidApp = () => {
  const [covidData, setCovidData] = useState();
  const dispatch = useDispatch();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pointWidth = 2;


  const dateIndex = useSelector(state => state.dateIndex);

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateRes = await fetchStateNyt();
        const countyRes = await fetchCountyNyt();
        setCovidData({ state: stateRes, county: countyRes });
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (covidData) {
      const numDays = covidData.state.size;

      if (dateIndex < numDays - 1) {
        timeout(() => {
          dispatch(dispatchDateIndex(dateIndex + 1))
        }, 250)
      }
    }
  },[dateIndex, covidData])

  return covidData && Number.isInteger(dateIndex)
  ?
  (
    <div className="CovidApp">
      <UsMap 
        stateData={covidData.state} 
        countyData={covidData.county} 
        dateIndex={dateIndex}
        measure={'totalCases'}
        width={width} 
        height={height} />
      {/* <DataPoints 
        countyData={covidData.county} 
        dateIndex={dateIndex}
        pointWidth={pointWidth}
        measure={'newCases'}
        width={width} 
        height={height} /> */}
    </div>
  )
  :
  null;
}

export default CovidApp;