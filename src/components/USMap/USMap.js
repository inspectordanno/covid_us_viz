import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { parse, add, isBefore, format } from 'date-fns';

import styles from './USMap.module.scss';
import scale from '../../util/scale';
import { dispatchDateIndex, dispatchDateIncrement, dispatchDomain } from '../../actions/actions';

import {
  getCountyFips,
  getFrequency,
  threeDayAverage,
  percentChange
} from "../../util/utilFunctions";
import stateTopo from "../../../dist/data/states-10m.json";
import countyTopo from "../../../dist/data/counties-10m.json";
import albersProjection from "../../util/albersProjection";

const UsMap = ({
  stateData,
  countyData,
  dateIndex,
  dateMap,
  measure,
  width,
  height,
}) => {
  const canvasRef = useRef();
  const projection = albersProjection(width, height);
  const pathGenerator = d3.geoPath().projection(projection);

  const thresholdScale = scale(measure);

  const getFreq = (fips) => { 
    if (measure === 'percentChangeCases') {
      return percentChange(countyData, dateIndex, dateMap, fips, 'newCases', { 'weeks': 1 });
    } else if (measure === 'percentChangeDeaths') {
      return percentChange(countyData, dateIndex, dateMap, fips, 'newDeaths', { 'weeks': 1 });
    } else {
      return threeDayAverage(countyData, dateIndex, fips, measure); //for raw number, use getFrequency(countyData, dateIndex, fips, measure)
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
          const freq = getFreq(fips);
          const fill = thresholdScale(freq);
          context.beginPath();
          pathGeneratorCanvas(feature);
          context.lineWidth = 0.25;
          context.fillStyle = fill;
          feature.id.substring(0, 2) === "72"
            ? (context.strokeStyle = fill) //no stroke for PR
            : (context.strokeStyle = "black"); 
          context.fill();
          context.stroke();
        }
      );
    }
  }, [canvasRef.current, dateIndex]);

  console.log(styles.USMap);

  return (
    <div className={styles.USMap}>
      <canvas
        width={width}
        height={height}
        ref={canvasRef}
      />
      <svg className={styles.states} width={width} height={height}>
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
