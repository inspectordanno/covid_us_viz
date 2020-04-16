import React, { useEffect, useState, useRef, Fragment } from 'react';
import * as d3 from 'd3';
import colors from '../util/colors';
import stateGeoJson from '../../dist/data/us_states.json';
import countyGeoJson from '../../dist/data/us_counties.json';
import stateFips from '../../dist/data/states_by_fips.json';
import { abbrDict, apStyleDict } from '../util/stateDictionary';

const UsMap = ({ nationalData, stateData, countyData, width, height }) => {

  const countiesContainer = useRef();
  const svgContainer = useRef();

   //gets bounding box 
   useEffect(() => {
    if (svgContainer.current && countiesContainer.current) {

      const svgBoundingBox = svgContainer.current
        .getBoundingClientRect();

      const countiesBoundingBox = countiesContainer.current
        .getBoundingClientRect();

      console.log("svgBoundingBox: ", svgBoundingBox);
      console.log("countiesBoundingBox: ", countiesBoundingBox);
    }
    
  }, [svgContainer.current, countiesContainer.current])
  
  const projection = d3.geoAlbersUsa()
    .translate([width * .5, height * .55])
    .scale(width * 1.25);

  const pathGenerator = d3.geoPath()
    .projection(projection);

  return true
  ?
  (
    <svg className="usmap"
      width={width}
      height={height}
      ref={svgContainer}
    >
      <g className="usmap_counties" ref={countiesContainer}>
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
      <g className="usmap_states" >
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