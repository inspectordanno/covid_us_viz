import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { timeout } from 'd3-timer';

import { fetchStateNyt, fetchCountyNyt } from '../util/dataFetches';
import { dispatchDateIndex } from '../actions/actions';
import UsMap from './UsMap';
import Nav from './Nav';
import DataPoints from './DataPoints';

const CovidApp = () => {
  const [covidData, setCovidData] = useState();
  const [dateMap, setDateMap] = useState();
  const dispatch = useDispatch();

  const dateIndex = useSelector(state => state.dateIndex);

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateRes = await fetchStateNyt();
        const countyRes = await fetchCountyNyt();
        const dateMapObj = {};
        countyRes.forEach((value, key) => dateMapObj[value.date] = key);
        setDateMap(dateMapObj);
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

  return covidData && dateMap && Number.isInteger(dateIndex)
  ?
  (
    <div className="CovidApp">
      <Nav 
        countyData={covidData.county}
        dateIndex={dateIndex}
      />
      <UsMap 
        stateData={covidData.state} 
        countyData={covidData.county} 
        dateIndex={dateIndex}
        dateMap={dateMap}
        measure={'totalCases'}
        measureType={'percentChange'} //rawNumber, rollingAverage, percentChange
        width={window.innerWidth} 
        height={window.innerHeight * .85} /> 
    </div>
  )
  :
  null;
}

export default CovidApp;