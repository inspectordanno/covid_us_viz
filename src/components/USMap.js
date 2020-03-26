import React, { useEffect, useState, useRef, Fragment } from 'react';
import * as d3 from 'd3';

import stateGeoJson from '../../dist/data/us_states.json';
import { abbrDict, apStyleDict } from '../util/stateDictionary';

const USMap = ({ nationalData, stateData, countyData, day }) => {

  //Puerto Rico is causing bugs, filtering out for now
  stateGeoJson.features = stateGeoJson.features.filter(d => d.properties.NAME !== 'Puerto Rico');

  const width = 1200;
  const height = 700;

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
      .range([1, 100]);

    return scale(dataValue);
  }

  const currentCountyData = countyData.find(entry => entry.date.dayOfYear() === day)
    .data.filter(d => d.countyData.cases && d.countyMetadata.coordinates)
     //filter if there are cases and coordinates of county
     //what about counties that don't have coordinates...geocode them?

  const currentStateData = stateData.find(entry => entry.date.dayOfYear() === day)
  console.log(day);

  return (
    <svg className="UsMap"
      width={width}
      height={height}
    >
      <g className="UsMap_states">
        {stateGeoJson.features.map(d =>
          <Fragment>
            <path 
              key={d.properties.NAME}
              d={pathGenerator(d)}
              className='us_state'
              id={d.properties.NAME}
              strokeWidth={0.25}
              stroke='black'
            />
            <text
              key={`${d.properties.NAME} label`}
              className='us_state_label'
              x={pathGenerator().centroid(d)[0]}
              y={pathGenerator().centroid(d)[1]}
              textAnchor="middle"
            >
              <tspan>
                `${apStyleDict[d.properties.NAME]}`
              </tspan>
              <tspan dy="10">
                `${currentStateData.find(state => state.state === abbrDict[d.properties.NAME]).positive}`
              </tspan>
            </text>
          </Fragment>
          )
        }
      </g>
      <g className="UsMap_cases">
          {
            currentCountyData.map(d => 
              <circle
                key={d.countyMetadata.locationKey}
                className='cases'
                id={`${d.countyMetadata.county} ${d.countyMetadata.state}`}
                r={scaleCircle(d.countyData.cases)}
                transform={`translate(${projection(d.countyMetadata.coordinates)})`}
                strokeWidth={1}
              />
            )
          }
      </g>
    </svg>
  );
}

export default USMap;