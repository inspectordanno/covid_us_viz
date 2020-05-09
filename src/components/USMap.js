import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSpring, animated } from "react-spring";

import stateGeoJson from "../../dist/data/us_states.json";
import countyGeoJson from "../../dist/data/us_counties.json";
import stateFips from "../../dist/data/states_by_fips.json";
import albersProjection from "../util/albersProjection";
import fipsExceptions from "../util/fipsExceptions";

const UsMap = ({
  stateData,
  countyData,
  dateIndex,
  measure,
  width,
  height,
}) => {
  const canvasRef = useRef();
  const projection = albersProjection(width, height);
  const pathGenerator = d3.geoPath().projection(projection);

  const getCountyFips = (properties) => {
    const boroughs = new Set(
      "New York",
      "Kings",
      "Bronx",
      "Richmond",
      "Queens"
    );

    //custom fips codes for nyc and puerto rico
    if (properties.STATE === "36" && boroughs.has(properties.NAME)) {
      return fipsExceptions.nyc;
    } else if (properties.STATE === "72") {
      return fipsExceptions.pr;
    } else {
      //last five characters of GEO_ID is fips code
      return properties.GEO_ID.slice(-5);
    }
  };

  const getFrequency = (data, fips, measure) => {
    const fipsData = data.get(fips);
    if (fipsData) {
      return fipsData[0][measure]; //for some reason data object is nested in an array
    } else {
      return 0; //return 0 if no data exists
    }
  };

  const schemeTurbo = [
    "#23171b",
    "#3987f9",
    "#2ee5ae",
    "#95fb51",
    "#feb927",
    "#e54813",
    "#900c00",
  ];

  const thresholdScale = d3
    .scaleThreshold()
    .domain([1, 10, 100, 1000, 10000, 100000])
    .range(schemeTurbo);

  //continue work on interpolate function
  const interpolateFill = () => {
    const todayData = countyData.get(dateIndex);
    const yesterdayData = countyData.get(dateIndex - 1);
    const fips = getCountyFips(feature.properties);
    const freqYesterday = dateIndex === 0 ? 0 : getFrequency(yesterdayData, fips, measure);
    const freqToday = getFrequency(todayData, fips, measure);

    const fills = [thresholdScale(freqYesterday), thresholdScale(freqToday)];
    return d3.interpolate(fills[0], fills[1]);
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = d3.select(canvasRef.current);
      const context = canvas.node().getContext("2d");

      const pathGeneratorCanvas = pathGenerator.context(context);

      const draw = (elapsed) => {
        //clear canvas
        // context.clearRect(0, 0, width, height);

        countyGeoJson.features.forEach(feature => {
          context.beginPath();
          pathGeneratorCanvas(feature);
          context.fillStyle = getFill(feature);
          context.lineWidth = .25;
          context.strokeStyle = 'black';
          context.fill();
          context.stroke();
        })

      };

      //constantly repeating draw function
      const t = d3.timer((elapsed) => {
        draw();
        if (elapsed > duration) t.stop();
      });

      // if (dateIndex > 1) {
      //   t.stop();
      // }

      //cleanup function that stops timer on every rerender
      // return () => t.stop();
    }
  }, [canvasRef.current, dateIndex]);

  return (
    <div className="UsMap">
      <canvas
        className="UsMap_counties"
        width={width}
        height={height}
        ref={canvasRef}
      />
      <svg className="UsMap_states" width={width} height={height}>
        <g>
          {stateGeoJson.features.map((d) => {
            //animate state fills
            // const frequency = getFrequency(
            //   todayStateData,
            //   d.properties.STATE,
            //   measure
            // );
            // const fillSpring = useSpring({
            //   to: { fill: thresholdScale(frequency) },
            // });

            return (
              <path
                key={d.properties.GEO_ID}
                d={pathGenerator(d)}
                className="us_state"
                id={d.properties.NAME}
                fill="transparent"
                strokeWidth={1}
                stroke="black"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default UsMap;
