import React, { useEffect, useState, useRef, Fragment } from 'react';
import * as d3 from 'd3';

import colors from '../util/colors';
import stateGeoJson from '../../dist/data/us_states.json';
import countyGeoJson from '../../dist/data/us_counties.json';
import stateFips from '../../dist/data/state_by_fips.json';
import { abbrDict, apStyleDict } from '../util/stateDictionary';

const USMap = ({ nationalData, stateData, countyData }) => {

  //Puerto Rico is causing bugs, filtering out for now
  stateGeoJson.features = stateGeoJson.features.filter(d => d.properties.NAME !== 'Puerto Rico');

  const width = 1200;
  const height = 700;

  const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(width * 1.25);

  const pathGenerator = d3.geoPath()
    .projection(projection);

  return (
    <svg className="UsMap"
      width={width}
      height={height}
    >
      <g className="UsMap_states">
        {stateGeoJson.features.map(d =>
          <path 
            key={d.properties.GEO_ID}
            d={pathGenerator(d)}
            className='us_state'
            id={d.properties.NAME}
            strokeWidth={0.5}
            stroke='black'
          />
        )}
      </g>
      <g className="UsMap_counties">
        {countyGeoJson.features.map(d => {
          <path 
            key={d.properties.GEO_ID}
            d={pathGenerator(d)}
            className='us_state'
            id={`${$d.properties.NAME}, ${stateFips[d.properties.STATE].abbreviation}`}
            strokeWidth={0.25}
            stroke='black'
          />
        })
        }
      </g>
    </svg>
  );
}

export default USMap;