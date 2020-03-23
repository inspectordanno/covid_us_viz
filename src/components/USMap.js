import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

import stateGeoJson from '../../dist/data/us_states.json';
import countyGeoJson from '../../dist/data/us_counties.json';
import colors from '../util/colors';
import statesDictionary from '../util/statesDictionary';

const USMap = ({ nationalData, stateData, countyData, day }) => {

  //Puerto Rico is causing bugs, filtering out for now
  stateGeoJson.features = stateGeoJson.features.filter(d => d.properties.NAME !== 'Puerto Rico');

  const width = 900;
  const height = 600;

  const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(width * 1.25);

  const pathGenerator = d3.geoPath()
    .projection(projection);

  const scaleCircle = (dataValue) => {
    const newestData = countyData[countyData.length - 1].data
    const cases = newestData.map(d => d.countyData.cases);
    const casesMax = d3.max(cases); //the largest amount of tests than a county has

    //log scale represents exponential growth
    const scale = d3.scaleLinear()
      .domain([0, casesMax])
      .range([1, 25]);

    return scale(dataValue);
  }

  const currentDayData = countyData.find(entry => entry.date.dayOfYear() === day).data;
  console.log(currentDayData.find(d => d.countyMetadata.county === 'Los Angeles County'));

  return (
    <svg className="UsMap"
      width={width}
      height={height}
    >
      <g className="UsMap_states">
        {stateGeoJson.features.map(d => 
          <path 
            key={d.properties.NAME}
            d={pathGenerator(d)}
            className='us_state'
            id={d.properties.NAME}
            strokeWidth={0.25}
            stroke='black'
          />
        )}
      </g>
      <g className="UsMap_cases">
          {
            currentDayData.map(d => {
              if (d.countyData.cases) {
                return (
                <circle
                  key={d.countyMetadata.featureId}
                  className='cases'
                  id={`${d.countyMetadata.county} ${d.countyMetadata.state}`}
                  fill={colors.theme_peach}
                  r={scaleCircle(d.countyData.cases)}
                  transform={`translate(${projection(d.countyMetadata.coordinates)})`}
                />
                );
              }
            })
          }
      </g>
      <g className="UsMap_state__tests">

      </g>
    </svg>
  );
}

export default USMap;