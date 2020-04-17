import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import * as d3 from 'd3';

import colors from '../util/colors';
import stateGeoJson from '../../dist/data/us_states.json';
import countyGeoJson from '../../dist/data/us_counties.json';
import stateFips from '../../dist/data/states_by_fips.json';
import { abbrDict, apStyleDict } from '../util/stateDictionary';
import { setSkyBbox } from '../actions/actions';

const UsMap = ({ stateData, countyData }) => {

  const countiesContainer = useRef();
  const svgContainer = useRef();
  const dispatch = useDispatch();

  const width = window.innerWidth * .8;
  const height = window.innerHeight;

   //gets bounding box 
   useEffect(() => {
      const countiesBoundingBox = countiesContainer.current
        .getBoundingClientRect();

      //represents the bounding box of the "sky"
      const skyBoundingBox = {
        top: 0, //top of the screen
        right: window.innerWidth, //right of the screen
        bottom: countiesBoundingBox.top, //bottom of the "sky" aka the top of the U.S.
        left: 0 //left of the screen
      }
    
      dispatch(setSkyBbox(skyBoundingBox));    
  }, [])
  
  const projection = d3.geoAlbersUsa()
    .translate([width * .5, height * .55])
    .scale(width * 1.25);

  const pathGenerator = d3.geoPath()
    .projection(projection);

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
            strokeWidth={0.25}
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