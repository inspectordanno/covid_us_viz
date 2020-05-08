import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSpring, animated } from 'react-spring';

import stateGeoJson from "../../dist/data/us_states.json";
import countyGeoJson from "../../dist/data/us_counties.json";
import stateFips from "../../dist/data/states_by_fips.json";
import albersProjection from "../util/albersProjection";
import fipsExceptions from '../util/fipsExceptions';

const UsMap = ({ stateData, countyData, dateIndex, measure, width, height }) => {

  const projection = albersProjection(width, height);
  const pathGenerator = d3.geoPath().projection(projection);

  const getCountyFips = (properties) => {
    const boroughs = { 
      'New York': true, 
      'Kings': true, 
      'Bronx': true, 
      'Richmond': true, 
      'Queens': true 
    };

    //custom fips codes for nyc and puerto rico
    if (properties.STATE === '36' && boroughs[properties.NAME]) {
      return fipsExceptions.nyc;
    } else if (properties.STATE === '72') {
      return fipsExceptions.pr;
    } else {
      //last five characters of GEO_ID is fips code
      return properties.GEO_ID.slice(-5);
    }
  }

  const todayCountyData = countyData.get(dateIndex);
  const todayStateData = stateData.get(dateIndex);

  const getFrequency = (data, fips, measure) => {
    const fipsData = data.get(fips);
    if (fipsData) { 
      return fipsData[0][measure]; //for some reason data object is nested in an array
    } else {
      return 0; //return 0 if no data exists
    }
  }

  const schemeTurbo = ["#23171b","#3987f9","#2ee5ae","#95fb51","#feb927","#e54813","#900c00"];

  const thresholdScale = d3.scaleThreshold()
    .domain([1, 10, 100, 1000, 10000, 100000])
    .range(schemeTurbo)

  useEffect(() => {
    //canvas work here
  },[dateIndex])

  return (
    <svg className="UsMap" width={width} height={height}>
      <g className="UsMap_counties" >
        {countyGeoJson.features.map(d => {
          const fips = getCountyFips(d.properties);
          const frequency = getFrequency(todayCountyData, fips, measure);
          const fillSpring = useSpring(
            { to: { fill: thresholdScale(frequency) } }
          );

          return (
            <animated.path
            key={d.properties.GEO_ID}
            d={pathGenerator(d)}
            className="us_county"
            id={`${d.properties.NAME}, ${
              stateFips[d.properties.STATE].abbreviation
            }`}
            fill={fillSpring.fill}
            strokeWidth={
              stateFips[d.properties.STATE].name === "Puerto Rico" ? 0 : 0.25
            }
            stroke="black"
          />
          )
        }  
        )}
      </g>
      <g className="UsMap_states" >
        {stateGeoJson.features.map(d => {
          const frequency = getFrequency(todayStateData, d.properties.STATE, measure);
          const fillSpring = useSpring(
            { to: { fill: thresholdScale(frequency) } }
          );

          return (
            <path
            key={d.properties.GEO_ID}
            d={pathGenerator(d)}
            className="us_state"
            id={d.properties.NAME}
            fill='transparent'
            strokeWidth={1}
            stroke="black"
            />
          )
        }  
        )}
      </g>
    </svg>
  );
};

export default UsMap;
