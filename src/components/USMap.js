import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { parse, add, isBefore, format } from 'date-fns';

import { dispatchDateIndex, dispatchDateIncrement } from '../actions/actions';

import {
  getCountyFips,
  getFrequency,
  threeDayAverage,
  percentChange
} from "../util/utilFunctions";
import stateTopo from "../../dist/data/states-10m.json";
import countyTopo from "../../dist/data/counties-10m.json";
import albersProjection from "../util/albersProjection";

const UsMap = ({
  stateData,
  countyData,
  dateIndex,
  dateMap,
  autoDateIncrement,
  measure,
  measureType,
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

  const getDomain = (measureType) => {
    if (measureType !== 'percentChange') {
      return [1, 10, 100, 1000, 10000, 100000];
    } else if (measureType === 'percentChange') {
      return [1, 5, 10, 50, 100, 1000];
    }
  }

  console.log(getDomain(measureType))

  const thresholdScale = d3
    .scaleThreshold()
    .domain(getDomain(measureType))
    .range(schemeTurbo);

  //object literal switch statement
  //gets frequency depending on measureType
  const getFreq = (measureType, fips) => { 
    const meastureTypes = {
      'rawNumber': getFrequency(countyData, dateIndex, fips, measure),
      'rollingAverage': threeDayAverage(countyData, dateIndex, fips, measure),
      'percentChange': percentChange(countyData, dateIndex, dateMap, fips, measure, { 'weeks': 1 })
    }
    return meastureTypes[measureType];
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = d3.select(canvasRef.current);
      const context = canvas.node().getContext("2d");
      const pathGeneratorCanvas = pathGenerator.context(context);

      feature(countyTopo, countyTopo.objects.counties).features.forEach(
        (feature) => {
          const fips = getCountyFips(feature.id);
          const freq = getFreq(measureType, fips);
          console.log(freq);
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
