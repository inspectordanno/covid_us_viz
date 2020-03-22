import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

import geojson from '../../dist/data/us_states.json';
import colors from '../util/colors';
import statesDictionary from '../util/statesDictionary';

const USMap = ({ nationalData, UsStateData, day }) => {

  //Puerto Rico is causing bugs, filtering out for now
  geojson.features = geojson.features.filter(d => d.properties.NAME !== 'Puerto Rico');

  const width = 900;
  const height = 600;

  const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(width * 1.25);

  const geoPath = d3.geoPath()
    .projection(projection);

  const scaleCircle = (dataValue) => {
    const newestData = UsStateData[0];
    const tests = newestData.data.map(entry => entry.total);
    const testsMax = d3.max(tests); //the largest amount of tests than an entry (municipality) has

    const scale = d3.scaleLinear()
      .domain([0, testsMax])
      .range([0, 25]);

    return scale(dataValue);
  }

  const getCircleRadius = (d) => {
    const currentDayData = UsStateData.find(entry => entry.date.dayOfYear() === day).data;
    const currentStateData = currentDayData.find(entry => statesDictionary[entry.state] === d.properties.NAME);
    if (currentStateData) {
      return scaleCircle(currentStateData.total);
    }
  }

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
      <g className="geoMap_county">
        {
          //put county map over the national map, so national borders are preserved. genius!
        }
      </g>
      <g className="geoMap_national__positives">
          {geojson.features.map(d => {
            return (
              <circle
              key={d.properties.NAME + '_tests'}
              cx={geoPath.centroid(d)[0]}
              cy={geoPath.centroid(d)[1]}
              className='tests_circle'
              id={d.properties.NAME + '_tests'}
              fill={colors.theme_peach}
              r={getCircleRadius(d)}
              />
            )
          }  
          )}
      </g>
      <g className="geoMap_national__tests">

      </g>
    </svg>
  );
}

export default USMap;