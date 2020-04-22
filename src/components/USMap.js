import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import * as d3 from 'd3';

import stateGeoJson from '../../dist/data/us_states.json';
import countyGeoJson from '../../dist/data/us_counties.json';
import stateFips from '../../dist/data/states_by_fips.json';
import albersProjection from '../util/albersProjection';
import { dispatchBbox } from '../actions/actions';

const UsMap = ({ stateData, countyData, countyFrequencies, width, height }) => {

  const countiesContainer = useRef();
  const svgContainer = useRef();
  const dispatch = useDispatch();

   //gets bounding box 
   useEffect(() => {
      const countiesBoundingBox = countiesContainer.current
        .getBoundingClientRect();

      //represents the bounding box of the "sky"
      const bbox = {
        top: 0, //top of the screen
        right: width, //right of the screen
        bottom: countiesBoundingBox.top, //bottom of the "sky" aka the top of the U.S.
        left: 0 //left of the screen
      }
    
      dispatch(dispatchBbox(bbox));    
  }, [])
  
  const projection = albersProjection(width, height);

  const pathGenerator = d3.geoPath()
    .projection(projection);

  //gets max number of totalCases or totalDeaths on most recent day
  //this will probably always default to NYC's total cases
  const getMaxTotal = (measure) => {
    const valuesfromLastDay = countyData[countyData.length - 1].map(d => d[measure]);
    return d3.max(valuesfromLastDay);
  }

  const countyScale = d3.scaleSequentialLog(
    [0, getMaxTotal('totalDeaths')], //domain
    d3.interpolateGreys //range interpolator
  );
  
  return true
  ?
  (
    <svg className="UsMap"
      width={width}
      height={height}
      ref={svgContainer}
    >
      <g className="UsMap_counties" ref={countiesContainer}>
        {countyGeoJson.features.map(d =>
          <path 
            key={d.properties.GEO_ID}
            d={pathGenerator(d)}
            className='us_county'
            id={`${d.properties.NAME}, ${stateFips[d.properties.STATE].abbreviation}`}
            strokeWidth={stateFips[d.properties.STATE].name === 'Puerto Rico' ? 0 : 0.25}
            stroke='black'
          />
        )}
      </g>
      <g className="UsMap_states" >
        {stateGeoJson.features.map(d =>
          <path 
            key={d.properties.GEO_ID}
            d={pathGenerator(d)}
            className='us_state'
            id={d.properties.NAME}
            strokeWidth={1}
            stroke='black'
          />
        )}
      </g>
    </svg>
  )
  :
  null;
}

export default UsMap;