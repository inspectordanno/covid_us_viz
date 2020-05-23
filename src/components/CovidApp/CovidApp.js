import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { timeout } from 'd3-timer';

import styles from './covidApp.module.scss';

import { fetchStateNyt, fetchCountyNyt, fetchCountryNyt } from '../../util/dataFetches';
import UsStateSelect from '../UsStateSelect/UsStateSelect';
import CountySelect from '../CountySelect/CountySelect';
import MeasureSelect from '../MeasureSelect/MeasureSelect';
import AreaChart from '../AreaChart/AreaChart';

const CovidApp = () => {
  const [covidData, setCovidData] = useState();
  const dispatch = useDispatch();

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryRes = await fetchCountryNyt();
        const stateRes = await fetchStateNyt();
        const countyRes = await fetchCountyNyt();
        console.log(countryRes);
        console.log(stateRes);
        console.log(countyRes);
        setCovidData({ country: countryRes, state: stateRes, county: countyRes });
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  const UsState = useSelector(state => state.UsState);
  const countyFips = useSelector(state => state.countyFips);
  const measure = useSelector(state => state.measure);

  const chartMargin = { left: 0, right: 0, top: 0, bottom: 0 };
  const chartWidth = 600;
  const chartHeight = 400;

  return covidData && UsState && countyFips && measure
  ?
  (
    <div className={styles.CovidApp}>
      <UsStateSelect />
      <CountySelect UsState={UsState} />
      <MeasureSelect />
      <AreaChart 
        covidData={covidData.county}
        countyFips={countyFips}
        measure={measure}
        averageWindow={3}
        width={chartWidth}
        height={chartHeight}
        margin={chartMargin}
      />
    </div>
  )
  :
  null;
}

export default CovidApp;