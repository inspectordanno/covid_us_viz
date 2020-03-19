import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { set } from 'd3';

import colors from '../util/colors';

const USMap = () => {

  const [geojson, setGeoJson] = useState();
  const mapContainer = useRef(null);
  const width = 900;
  const height = 600;

  //fetches geoJson
  useEffect(() => {

    // //synchronous
    // const jsonRes = JSON.parse('./data/us_states.json');
    // setGeoJson(jsonRes.features);

    // asynchronous
    const fetchSvg = async () => {
      try {
        const jsonRes = await d3.json('./data/us_states.json');
        setGeoJson(jsonRes.features);
      } catch (e) {
        console.error(e);
      }
    }

    fetchSvg();
  }, []);

  const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(width * 1.25);

  const geoPath = d3.geoPath()
    .projection(projection);

  // if (svg && mapContainer.current) {
  //   //d3 work here...
  // }

  return geojson
  ?
  (
    <svg className="USMap"
      width={width}
      height={height}
    >
      <g className="geoMap_national">
        {geojson.map(d => console.log(d))}
        {geojson.map((d) => 
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
    </svg>
  )
  :
  null;
}

export default USMap;