import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { timeout } from 'd3-timer';

import styles from './covidApp.module.scss';

import { fetchStateNyt, fetchCountyNyt, fetchCountryNyt } from '../../util/dataFetches';
import { dispatchDateIndex } from '../../actions/actions';
import UsMap from '../USMap/USMap';
import Header from '../Header/Header';
import AreaChart from '../AreaChart/AreaChart';

const CovidApp = () => {
  const [covidData, setCovidData] = useState();
  const [dateMap, setDateMap] = useState();
  const dispatch = useDispatch();

  const dateIndex = useSelector(state => state.dateIndex);
  const dateIncrement = useSelector(state => state.dateIncrement)
  const measure = useSelector(state => state.measure);

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryRes = await fetchCountryNyt();
        const stateRes = await fetchStateNyt();
        const countyRes = await fetchCountyNyt();
        // const dateMapObj = {};
        // countyRes.forEach((value, key) => dateMapObj[value.date] = key);
        // setDateMap(dateMapObj);
        setCovidData({ country: countryRes, state: stateRes, county: countyRes });
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  return covidData && measure
  ?
  (
    <div className={styles.CovidApp}>
      <AreaChart />
    </div>
  )
  :
  null;
}

export default CovidApp;