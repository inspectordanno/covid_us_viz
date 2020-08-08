import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { timeParse } from "d3-time-format";
import { greatest } from "d3-array";
import { withScreenSize } from "@vx/responsive";
import { useHistory, useParams } from "react-router-dom";

import styles from "./CovidApp.module.scss";

import stateFipsDict from "../../data/name_fips_pop.json";
import statesLowercaseDict from "../../data/states_lower_case.json";
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
import AxisBottom from '../AxisBottom/AxisBottom';

const CovidApp = ({ screenWidth, screenHeight }) => {
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

  const lowerCase = (str) => str.replace(/ /g, "").toLowerCase();

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
      const titleCaseState = statesLowercaseDict[params.state];

      const titleCaseCounty = stateFipsDict[titleCaseState].find((county) => {
        return lowerCase(county.countyName) === params.county;
      });

      dispatch(dispatchUsState(titleCaseState));
      dispatch(dispatchCounty(titleCaseCounty));
    }
  }, [covidData]);

  //update route
  useEffect(() => {
    if (UsState && county) {
      console.log(UsState);
      //eliminate spaces and lowercase
      const formattedState = lowerCase(UsState);
      const formattedCounty = lowerCase(county.countyName);
      //push to new route
      history.push(`/${formattedState}/${formattedCounty}`);
      console.log(params);
    }
  }, [UsState, county]);

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

  //only filtering dates that are March 1st, 2020 or later
  const getCountyPlotData = () => getPlotData(covidData.county, county.fips)
    .filter(data => data.date >= new Date('03/01/2020'));

  const getStatePlotData = () => {
    const statePlotData = getPlotData(covidData.state, UsState);
    return getDateIntersection(statePlotData, getCountyPlotData());
  };

  const getCountryPlotData = () => {
    const countryPlotData = getPlotData(covidData.country, null);
    return getDateIntersection(countryPlotData, getCountyPlotData());
  };

  const getDimensions = (screenWidth) => {
    const dimensions = {};

    if (screenWidth <= 480) {
      dimensions.width = .95 * screenWidth;
      dimensions.height = .25 * screenHeight;
    } else {
      dimensions.width = .7 * screenWidth;
      dimensions.height = .2 * screenHeight;
    }

    return dimensions;
  }

  console.log(screenWidth)

  const chartWidth = getDimensions(screenWidth).width;
  const chartHeight = getDimensions(screenWidth).height;
  const chartMargin = { left: 60, right: 0, top: 10, bottom: 0 };

  const dependencies = covidData && UsState && county && measure;

  return dependencies ? (
    <div className={styles.app}>
      <div className={styles.headline}>
        No B.S. COVID Tracker
      </div>
      <div className={styles.measureContainer}>
        <UsStateSelect UsState={UsState} />
        <CountySelect
          countyData={covidData.county}
          UsState={UsState}
          county={county}
        />
        <MeasureSelect />
      </div>
      <AreaChart
        plotData={getCountyPlotData()}
        name={county.countyName}
        measure={measure}
        width={chartWidth}
        height={chartHeight}
        margin={chartMargin}
        screenWidth={screenWidth}
      />
      <AreaChart
        plotData={getStatePlotData()}
        name={UsState}
        measure={measure}
        width={chartWidth}
        height={chartHeight}
        margin={chartMargin}
        screenWidth={screenWidth}
      />
      <AreaChart
        plotData={getCountryPlotData()}
        name={"United States"}
        measure={measure}
        width={chartWidth}
        height={chartHeight}
        margin={chartMargin}
        screenWidth={screenWidth}
      />
      <AxisBottom 
        dates={getCountryPlotData().map(d => d.date)}
        width={chartWidth}
        margin={chartMargin}
        screenWidth={screenWidth}
      />
    </div>
  ) : null;
};

export default withScreenSize(CovidApp);
