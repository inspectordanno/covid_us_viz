import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

const USMap = () => {

  const [svg, setSvg] = useState();
  const mapContainer = useRef(null);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const svgRes = await d3.svg('./data/us_counties.svg')
        console.log(svgRes.documentElement);
        setSvg(svgRes.documentElement);

      } catch (e) {
        console.error(e);
      }
    }

    fetchSvg();
  }, []);

  if (svg && mapContainer.current) {
    //d3 work here...
  }

  return (
    <div ref={mapContainer}>
      USMap
    </div>
  );
}

export default USMap;