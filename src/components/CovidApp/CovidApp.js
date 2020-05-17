import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { timeout } from 'd3-timer';

import styles from './covidApp.module.scss';

import { fetchStateNyt, fetchCountyNyt } from '../../util/dataFetches';
import { dispatchDateIndex } from '../../actions/actions';
import UsMap from '../USMap/USMap';
import Header from '../Header/Header';

const CovidApp = () => {
  const [covidData, setCovidData] = useState();
  const [dateMap, setDateMap] = useState();
  const dispatch = useDispatch();

  const dateIndex = useSelector(state => state.dateIndex);
  const domain = useSelector(state => state.domain);

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

  return covidData && dateMap && domain && Number.isInteger(dateIndex)
  ?
  (
    <div className={styles.CovidApp}>
      <Header 
        dateIndex={dateIndex}
        dateMap={dateMap}
        domain={domain}
      />
      <UsMap 
        stateData={covidData.state} 
        countyData={covidData.county} 
        dateIndex={dateIndex}
        dateMap={dateMap}
        measureType={'total'} //total, new, percentChange
        measure={'Cases'} //Cases, Deaths
        isPercentChange={true}
        width={window.innerWidth} 
        height={window.innerHeight * .85} /> 
    </div>
  )
  :
  null;
}

export default CovidApp;