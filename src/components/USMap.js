import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

import geojson from '../../dist/data/us_states.json';
import colors from '../util/colors';
import Circle from './Circle';

const USMap = ({ nationalData, day, geoJson }) => {

  const width = 900;
  const height = 600;

  const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(width * 1.25);

  const geoPath = d3.geoPath()
    .projection(projection);

  const currentDayData = nationalData.find(entry => entry.date.dayOfYear() === day);

  return (
    <svg className="USMap"
      width={width}
      height={height}
    >
      <g className="geoMap_national">
        {geojson.features.map((d) => 
          <path 
            key={d.properties.NAME}
            d={geoPath(d)}
            className='us_state'
            id={d.properties.NAME}
            strokeWidth={0.25}
            stroke='black'
          />
        )}
      </g>
      <g className="geoMap_national__positives">
          {

          }
      </g>
      <g className="geoMap_national__tests">

      </g>
    </svg>
  )
}

export default USMap;