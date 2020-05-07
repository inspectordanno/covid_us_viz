import React from "react";
import * as d3 from "d3";

import stateGeoJson from "../../dist/data/us_states.json";
import countyGeoJson from "../../dist/data/us_counties.json";
import stateFips from "../../dist/data/states_by_fips.json";
import albersProjection from "../util/albersProjection";
import fipsExceptions from '../util/fipsExceptions';

const UsMap = ({ stateData, countyData, dateIndex, width, height }) => {

  const projection = albersProjection(width, height);
  const pathGenerator = d3.geoPath().projection(projection);

  const mapScale = d3.scaleThreshold()
    .domain([1, 10, 100, 1000, 10000])
    .range(d3.schemePuBuGn[6])

  const getFips = (properties) => {
    const boroughs = { 'New York': true, 'Kings': true, 'Bronx': true, 'Richmond': true, 'Queens': true };

    //custom fips codes for nyc and puerto rico
    if (properties.STATE === '36' && boroughs[properties.NAME]) {
      return fipsExceptions.nyc;
    } else if (properties.STATE === '72') {
      return fipsExceptions.pr;
    } else {
      //last five characters of GEO_ID is fips code
      return properties.GEO_ID.slice(-5);
    }
  }

  return (
    <svg className="UsMap" width={width} height={height}>
      <g className="UsMap_counties" >
        {countyGeoJson.features.map(d => {
          const fips = getFips(d.properties);

          return (
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
          />
          )
        }  
        )}
      </g>
      <g className="UsMap_states" >
        {stateGeoJson.features.map(d => 
            <path
            key={d.properties.GEO_ID}
            d={pathGenerator(d)}
            className="us_state"
            id={d.properties.NAME}
            strokeWidth={1}
            stroke="black"
            />
        )}
      </g>
    </svg>
  );
};

export default UsMap;
