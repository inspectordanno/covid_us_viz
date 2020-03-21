import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

import geojson from '../../dist/data/us_states.json';
import colors from '../util/colors';
import Circle from './Circle';

const USMap = ({ nationalData, UsStateData, day }) => {

  const width = 900;
  const height = 600;

  const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(width * 1.25);

  const geoPath = d3.geoPath()
    .projection(projection);

  const currentDayData = UsStateData.find(entry => entry.date.dayOfYear() === day).data;
  console.log(currentDayData);

  const scaleCircle = (dataValue) => {
    const newestData = UsStateData[0];
    const tests = newestData.data.map(entry => entry.total);
    const testsMax = d3.max(tests); //the largest amount of tests than an entry (municipality) has

    const scale = d3.scaleLinear()
      .domain([0, testsMax])
      .range([0, 10]);

    return scale(dataValue);
  }

  // const getStateCircle = (currentDayData) => {
  //   const currentState = currentDayData.find(entry => entry.state === )
  // }

  return currentDayData ?
  (
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
          {geojson.features.map((d) => 
            <circle
              key={d.properties.NAME + '_tests'}
              x={geoPath.centroid(d)[0]}
              y={geoPath.centroid(d)[1]}
              className='tests_circle'
              id={d.properties.NAME + '_tests'}
              fill={colors.theme_green}
              r={scaleCircle(currentDayData.total)}
            />
          )}
          {geojson.features.map(d => console.log(d))}
      </g>
      <g className="geoMap_national__tests">

      </g>
    </svg>
  )
  :
  null;
}

export default USMap;