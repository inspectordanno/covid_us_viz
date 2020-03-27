import React, { useEffect, useState, useRef, Fragment } from 'react';
import * as d3 from 'd3';

import colors from '../util/colors';
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

  const currentCountyData = countyData.find(entry => entry.date === day)
    .data.filter(d => d.countyData.cases && d.countyMetadata.coordinates)
     //filter if there are cases and coordinates of county
     //what about counties that don't have coordinates...geocode them?

  const getStatePositives = (stateName) => {
    const foundState = stateData.find(entry => entry.date === day)
      .data.find(entry => entry.state === abbrDict[stateName]);

    //if state exists in that days data, return amount of positve cases
    //if it doesn't exist, return 0
    return foundState ? foundState.positive : 0;
  }

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
          {currentCountyData.map(d => 
              <circle
                key={d.countyMetadata.locationKey}
                className='cases_circle'
                id={`${d.countyMetadata.county} ${d.countyMetadata.state}`}
                r={scaleCircle(d.countyData.cases)}
                transform={`translate(${projection(d.countyMetadata.coordinates)})`}
                strokeWidth={1}
              />
          )}
      </g>
      <g className="UsMap_labels">
        {stateGeoJson.features.map(d => {
          const stateName = d.properties.NAME;
          return (
          <text
              key={`${stateName} label`}
              className="us_state__label"
              x={pathGenerator.centroid(d)[0]}
              y={pathGenerator.centroid(d)[1]}
            >
            <tspan 
              className="us_state__name"
              textAnchor='middle'
              >
              {apStyleDict[stateName]}
            </tspan>
            <tspan 
              className="us_state__value"
              dx="-25"
              dy="20"
              textAnchor='middle'
              >
              {getStatePositives(stateName)}
            </tspan>
          </text>
          );
        })
        }
      </g>
    </svg>
  );
}

export default USMap;