import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { timeParse } from 'd3-time-format';
import sma from 'sma';

import styles from './covidApp.module.scss';

import stateFipsDict from '../../data/state_fips_dict.json';
import { dispatchUsState, dispatchCountyFips } from '../../actions/actions';
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

  //gets random state and county and dispatches to store
  useEffect(() => {
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (covidData) {

      const usStates = [ ...covidData.state.keys() ];
      const randomState = getRandomElement(usStates);
      const counties = stateFipsDict[randomState];
      const validCounties = counties.filter(county => covidData.county.has(county.fips));
      const randomCounty = getRandomElement(validCounties).fips;

      dispatch(dispatchUsState(randomState));
      dispatch(dispatchCountyFips(randomCounty));
    }
  }, [covidData]);

  const UsState = useSelector(state => state.UsState);
  const countyFips = useSelector(state => state.countyFips);
  const measure = useSelector(state => state.measure);

  const chartMargin = { left: 0, right: 0, top: 0, bottom: 0 };
  const chartWidth = 600;
  const chartHeight = 400;
  const movingAverageWindow = 7; //average over 7 days
  const parseTime = timeParse('%Y-%m-%d');

  const getPlotData = (data, dataKey) => {
    const fipsData = data.get(dataKey);
    const dates = fipsData.map(d => parseTime(d.date));
    const measureNumbers = fipsData.map(d => d[measure]);
    const measureAverages = sma(measureNumbers, movingAverageWindow, n => Math.round(n));

    return measureAverages.map((d, i) => {
      return { date: dates[i], data: d }
    });
  }

  const dependencies = covidData && UsState && countyFips && measure;

  const statePlotData = (dependencies) ? getPlotData(covidData.state, UsState) : null;
  const countyPlotData = (dependencies) ? getPlotData(covidData.county, countyFips) : null;

  return dependencies
  ?
  (
    <div className={styles.CovidApp}>
      <UsStateSelect UsState={UsState} />
      <CountySelect 
        countyData={covidData.county}
        UsState={UsState} />
      <MeasureSelect />
      <AreaChart 
        plotData={countyPlotData}
        measure={measure}
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