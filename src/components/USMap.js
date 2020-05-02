import React, { useEffect, useState, useRef, Fragment } from "react";
import { useDispatch } from "react-redux";
import * as d3 from "d3";
import { group } from "d3-array";

import stateGeoJson from "../../dist/data/us_states.json";
import countyGeoJson from "../../dist/data/us_counties.json";
import stateFips from "../../dist/data/states_by_fips.json";
import albersProjection from "../util/albersProjection";
import { dispatchBbox } from "../actions/actions";

const UsMap = ({ stateData, countyData, dateIndex, pointWidth, width, height }) => {
  const countiesContainer = useRef();
  const statesContainer = useRef();
  const countyRef = useRef();
  const stateRef = useRef();
  const dispatch = useDispatch();
  const [counties, setCounties] = useState([]);

  const getFrequencyCount = (dateIndex, measure) => {
    const countsObj = {};
    const counts = countyData[dateIndex][1];

    counts.forEach((d) => {
      countsObj[d.fips] = d[measure];
    });
    return countsObj;
  };

  const getYesterdayFrequencyCount = (measure) => {
    //no yesterday if first day
    return dateIndex === 0
      ? getFrequencyCount(dateIndex, measure)
      : getFrequencyCount(dateIndex - 1, measure);
  };

  const yesterdayFreqCount = getYesterdayFrequencyCount("totalCases");

  const projection = albersProjection(width, height);

  const pathGenerator = d3.geoPath().projection(projection);

  //gets max number of totalCases or totalDeaths on most recent day
  //this will probably always default to NYC's total cases
  const getMaxTotal = (measure) => {
    const valuesfromLastDay = countyData[countyData.length - 1].map(
      (d) => d[measure]
    );
    return d3.max(valuesfromLastDay);
  };

  const countyScale = d3.scaleSequentialLog(
    [0, getMaxTotal("totalDeaths")], //domain
    d3.interpolateGreys //range interpolator
  );

  useEffect(() => {
    const states = d3.select(statesContainer.current)
      .selectAll('us_state')
      .data(stateGeoJson.features)
    
      states.enter()
        .append('path')
        .attr('class', 'us_state')
        .attr('d', d => pathGenerator(d))
        .attr('id', d => d.properties.NAME)
        .attr('strokeWidth', 1)
        .attr('stroke', 'black')

      const allPoints = [];

      for (let x = 0; x <= width; x += pointWidth) {
        for (let y = 0; y <= height; y += pointWidth) {
          allPoints.push([x, y]);
        }
      }

      console.log(allPoints);

      const nodes = d3.selectAll('.us_state').nodes();
      console.log(nodes);
  }, [])

  return (
    <svg className="UsMap" width={width} height={height}>
      <g className="UsMap_counties" ref={countiesContainer}>
        {countyGeoJson.features.map(d =>  
          <path
            key={d.properties.GEO_ID}
            d={pathGenerator(d)}
            className="us_county"
            id={`${d.properties.NAME}, ${
              stateFips[d.properties.STATE].abbreviation
            }`}
            strokeWidth={
              stateFips[d.properties.STATE].name === "Puerto Rico" ? 0 : 0.25
            }
            stroke="black"
            ref={countyRef}
          />
        )}
      </g>
      <g className="UsMap_states" ref={statesContainer}>
        {/* {stateGeoJson.features.map((d) => {
          if (stateRef.current && counties.length !== 52) {
            console.log(stateRef.current);
          }
          return (
            <path
            key={d.properties.GEO_ID}
            d={pathGenerator(d)}
            className="us_state"
            id={d.properties.NAME}
            strokeWidth={1}
            stroke="black"
            ref={stateRef}
            />
          )}
        )} */}
      </g>
    </svg>
  );
};

export default UsMap;
