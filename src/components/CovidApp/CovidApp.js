import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { timeParse } from 'd3-time-format';
import { greatest, mean } from 'd3-array';
import sma from 'sma';

import styles from './covidApp.module.scss';

import stateFipsDict from '../../data/name_fips_pop.json';
import { dispatchUsState, dispatchCounty } from '../../actions/actions';
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
  
        setCovidData({ country: countryRes, state: stateRes, county: countyRes });
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  const UsState = useSelector(state => state.UsState);
  const county = useSelector(state => state.county);
  const measure = useSelector(state => state.measure);

  //gets random state and county and dispatches to store
  useEffect(() => {
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (covidData) {
      //get random state
      const usStates = [ ...covidData.state.keys() ];
      const randomState = getRandomElement(usStates);

      //gets random or most populous county
      const counties = stateFipsDict[randomState];
      const validCounties = counties.filter(county => covidData.county.has(county.fips));
      const mostPopCounty = greatest(validCounties, d => d.pop_2019);
      const randomCounty = getRandomElement(validCounties);

      //initialize with random state and random/most populous county
      dispatch(dispatchUsState(randomState));
      dispatch(dispatchCounty(mostPopCounty)); //or randomCounty
    }
  }, [covidData]);

  const chartMargin = { left: 0, right: 0, top: 0, bottom: 0 };
  const chartWidth = 600;
  const chartHeight = 400;

  const getPlotData = (data, dataKey) => {
    const parseTime = timeParse('%Y-%m-%d');

    const muniData = dataKey ? data.get(dataKey) : data; //if dataKey exists, use it. if it does not, use original data (country-level)
    const dates = muniData.map(d => parseTime(d.date));
    const measureNumbers = muniData.map(d => d[measure]);
    const measureAverages = sma(measureNumbers, movingAverageWindow, n => Math.round(n));

    return measureAverages.map((d, i) => ({ date: dates[i], rawNumber: measureNumbers[i], average: d }));
  }

  //trims dates with 0 values from beginning of array
  // const trimBeginningEmptyValues = (plotData) => {
  //   let firstDataPointHit = false;

  //   const finalData = [];

  //   plotData.forEach((entry) => {
  //     //if entry.data === 0 and the first data point with data hasn't been hit do nothing
  //     //if it has been hit, push entry to array 
  //     if (!firstDataPointHit && entry.data) {
  //       firstDataPointHit = true;
  //     }
  //     if (firstDataPointHit) {
  //       finalData.push(entry);
  //     }
  //   });

  //   return finalData;
  // }

  const getDateIntersection = (plotDataOne, plotDataTwo) => {
    //make a set of dates to compare with
    const compare = new Set(plotDataTwo.map(d => d.date.getTime()));

    //filter values - if set has current date, then return 
    return plotDataOne.filter(d => compare.has(d.date.getTime()))
  }

  const getCountyPlotData = () => getPlotData(covidData.county, county.fips);

  const getStatePlotData = () => {
    const statePlotData = getPlotData(covidData.state, UsState);
    return getDateIntersection(statePlotData, getCountyPlotData());
  }

  const getCountryPlotData = () => {
    const countryPlotData = getPlotData(covidData.country, null);
    return getDateIntersection(countryPlotData, getCountyPlotData());
  }

  const dependencies = covidData && UsState && county && measure;

  return dependencies
  ?
  (
    <div className={styles.CovidApp}>
      <UsStateSelect UsState={UsState} />
      <CountySelect 
        countyData={covidData.county}
        UsState={UsState}
        county={county} />
      <MeasureSelect />
      <AreaChart 
        plotData={getCountyPlotData()}
        level={'county'}
        name={county.countyName}
        measure={measure}
        width={chartWidth}
        height={chartHeight}
        margin={chartMargin}
      />
       <AreaChart 
        plotData={getStatePlotData()}
        level={'state'}
        name={UsState}
        measure={measure}
        width={chartWidth}
        height={chartHeight}
        margin={chartMargin}
      />
      <AreaChart 
        plotData={getCountryPlotData()}
        level={'country'}
        name={'United States'}
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