import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { timeParse } from "d3-time-format";
import { greatest } from "d3-array";
import { useHistory, useParams } from "react-router-dom";

import styles from "./covidApp.module.scss";

import stateFipsDict from "../../data/name_fips_pop.json";
import statesLowercaseDict from '../../data/states_lower_case.json';
import countiesLowercaseDict from '../../data/counties_lower_case.json';
import { getMovingAverage } from "../../util/utilFunctions";
import { dispatchUsState, dispatchCounty } from "../../actions/actions";
import {
  fetchStateNyt,
  fetchCountyNyt,
  fetchCountryNyt,
} from "../../util/dataFetches";
import UsStateSelect from "../UsStateSelect/UsStateSelect";
import CountySelect from "../CountySelect/CountySelect";
import MeasureSelect from "../MeasureSelect/MeasureSelect";
import AreaChart from "../AreaChart/AreaChart";

const CovidApp = () => {
  const [covidData, setCovidData] = useState();
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryRes = await fetchCountryNyt();
        const stateRes = await fetchStateNyt();
        const countyRes = await fetchCountyNyt();

        setCovidData({
          country: countryRes,
          state: stateRes,
          county: countyRes,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const UsState = useSelector((state) => state.UsState);
  const county = useSelector((state) => state.county);
  const measure = useSelector((state) => state.measure);
  
  useEffect(() => {
    const urlHasParams = !!Object.keys(params).length;

    //gets random element and dispatches to store (if navigating to root site with no params in url)
    if (covidData && !urlHasParams) {
      const getRandomElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

      //get random state
      const usStates = [...covidData.state.keys()];
      const randomState = getRandomElement(usStates);

      //gets random or most populous county
      const counties = stateFipsDict[randomState];
      const validCounties = counties.filter((county) =>
        covidData.county.has(county.fips)
      );
      const mostPopCounty = greatest(validCounties, (d) => d.pop_2019);
      const randomCounty = getRandomElement(validCounties);

      //initialize with random state and random/most populous county
      dispatch(dispatchUsState(randomState));
      dispatch(dispatchCounty(mostPopCounty)); //or randomCounty
    } 
      //if there are params when first visiting site, get each param, lookup in dict, and dispatch to store
      else if (covidData && urlHasParams) {
        dispatch(dispatchUsState(statesLowercaseDict[params.state]));
        dispatch(dispatchCounty(countiesLowercaseDict[params.county]));
    }
  }, [covidData]);

  //update route
  useEffect(() => {
    if (UsState && county) {
      //eliminate spaces and lowercase
      const formattedState = UsState.replace(/ /g,'').toLowerCase();
      const formattedCounty = county.countyName.replace(/ /g,'').toLowerCase();
      //push to new route
      history.push(`/${formattedState}/${formattedCounty}`);
      console.log(params);
    }
  }, [UsState, county])

  const getPlotData = (data, dataKey) => {
    const parseTime = timeParse("%Y-%m-%d");

    const muniData = dataKey ? data.get(dataKey) : data; //if dataKey exists, use it. if it does not, use original data (country-level)
    const dates = muniData.map((d) => parseTime(d.date));
    const measureNumbers = muniData.map((d) => d[measure]);
    const measureAverages = getMovingAverage(measureNumbers, 7);

    return measureAverages.map((d, i) => ({
      date: dates[i],
      rawNumber: measureNumbers[i],
      average: d,
    }));
  };

  const getDateIntersection = (plotDataOne, plotDataTwo) => {
    //make a set of dates to compare with
    const compare = new Set(plotDataTwo.map((d) => d.date.getTime()));

    //filter values - if set has current date, then return
    return plotDataOne.filter((d) => compare.has(d.date.getTime()));
  };

  const getCountyPlotData = () => getPlotData(covidData.county, county.fips);

  const getStatePlotData = () => {
    const statePlotData = getPlotData(covidData.state, UsState);
    return getDateIntersection(statePlotData, getCountyPlotData());
  };

  const getCountryPlotData = () => {
    const countryPlotData = getPlotData(covidData.country, null);
    return getDateIntersection(countryPlotData, getCountyPlotData());
  };

  const dependencies = covidData && UsState && county && measure;

  return dependencies ? (
    <div className={styles.CovidApp}>
      <UsStateSelect UsState={UsState} />
      <CountySelect
        countyData={covidData.county}
        UsState={UsState}
        county={county}
      />
      <MeasureSelect />
      <AreaChart
        plotData={getCountyPlotData()}
        level={"county"}
        name={county.countyName}
        measure={measure}
      />
      <AreaChart
        plotData={getStatePlotData()}
        level={"state"}
        name={UsState}
        measure={measure}
      />
      <AreaChart
        plotData={getCountryPlotData()}
        level={"country"}
        name={"United States"}
        measure={measure}
      />
    </div>
  ) : null;
};

export default CovidApp;
