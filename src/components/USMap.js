import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { useSpring, animated } from "react-spring";

import {
  getCountyFips,
  getFrequency,
  threeDayAverage,
} from "../util/utilFunctions";
import stateTopo from "../../dist/data/states-10m.json";
import countyTopo from "../../dist/data/counties-10m.json";
import stateFips from "../../dist/data/states_by_fips.json";
import albersProjection from "../util/albersProjection";
import fipsExceptions from "../util/fipsExceptions";
import { dispatchDateIndex } from "../actions/actions";

const UsMap = ({
  stateData,
  countyData,
  dateIndex,
  measure,
  isRollingAvg,
  width,
  height,
}) => {
  const canvasRef = useRef();
  const projection = albersProjection(width, height);
  const pathGenerator = d3.geoPath().projection(projection);
  const dispatch = useDispatch();

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
  const interpolateFill = (elapsed, duration, feature) => {
    const todayData = countyData.get(dateIndex);
    const yesterdayData = countyData.get(dateIndex - 1);
    const fips = getCountyFips(feature.properties);
    const freqYesterday = !yesterdayData
      ? 0
      : getFrequency(yesterdayData, fips, measure);
    const freqToday = getFrequency(todayData, fips, measure);

    //if no change, return same color; if change, interpolate to new color
    if (freqYesterday === freqToday) {
      return thresholdScale(freqToday);
    } else {
      const t = d3.interpolateRgb(
        thresholdScale(freqYesterday),
        thresholdScale(freqToday)
      );
      return t(elapsed / duration);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = d3.select(canvasRef.current);
      const context = canvas.node().getContext("2d");
      const pathGeneratorCanvas = pathGenerator.context(context);

      feature(countyTopo, countyTopo.objects.counties).features.forEach(
        (feature) => {
          const fips = getCountyFips(feature.id);
          const freq = isRollingAvg
            ? threeDayAverage(countyData, dateIndex, fips, measure)
            : getFrequency(countyData, dateIndex, fips, measure);
          const fill = thresholdScale(freq);

          context.beginPath();
          pathGeneratorCanvas(feature);
          context.lineWidth = 0.25;
          context.fillStyle = fill;
          feature.id.substring(0, 2) === "72"
            ? (context.strokeStyle = fill)
            : (context.strokeStyle = "black"); //no stroke for PR
          context.fill();
          context.stroke();
        }
      );
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
          {feature(stateTopo, stateTopo.objects.states).features.map(
            (feature) => {
              return (
                <path
                  key={feature.id}
                  d={pathGenerator(feature)}
                  className="us_state"
                  id={feature.properties.name}
                  fill="transparent"
                  strokeWidth={1}
                  stroke="black"
                />
              );
            }
          )}
        </g>
      </svg>
    </div>
  );
};

export default UsMap;
