import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as d3 from "d3";
import { randomInt } from 'd3-random';

import mainRegl from '../webgl/regl';
import { dispatchDateIndex } from "../actions/actions";
import albersProjection from "../util/albersProjection";

const DataPoints = ({ countyData, dateIndex, pointWidth, width, height }) => {
  const canvasRef = useRef();
  const dispatch = useDispatch();

  const projection = albersProjection(width, height);

  const calculateStartPoints = () => {
    const x = randomInt(0, width + 1)();
    const y = randomInt(0, height + 1)();
    return [x, y];
  };

  //generates a point for each datum on a specific day
  const generatePointData = (measure, dateIndex) => {
    const pointData = []; //pointData will be pushed to this array
    const dayData = countyData[dateIndex][1];

    dayData.forEach((d) => {
      //repeat for every county's new case/death count
      let timesToRepeat = d[measure]; //measure should be either "newCases" or "newDeaths"

      const totalMeasure =
        measure === "newCases" ? "totalCases" : "totalDeaths"; //setting the the analogous total measure

      const endPoints = projection(d.coordinates);

      while (timesToRepeat) {
        //randomize start points for each point
        const startPoints = calculateStartPoints();

        pointData.push({
          date: d.date,
          dateIndex,
          fips: d.fips,
          nthPoint: d[totalMeasure] - timesToRepeat + 1,
          startX: startPoints[0],
          startY: startPoints[1],
          endX: endPoints[0],
          endY: endPoints[1]
        });
        timesToRepeat -= 1;
      }
    });
    return pointData;
  };

  const generateCumPointData = (measure, lastDateIndex) => {
    //d3.range(lastDateIndex + 1) produces an array of all the date indexes
    //for each date index, generate point data and push to cum
    const cumPointData = [];
    d3.range(lastDateIndex + 1).forEach(dateIndex => {
      const dayPointData = generatePointData(measure, dateIndex);
      cumPointData.push(dayPointData);
    });
    return cumPointData;
  };

  const todayData = generatePointData("newCases", dateIndex); //choose 'newCases' or 'newDeaths'
  //const cumData = generateCumPointData("newCases", dateIndex);
  
  //creating regl instance with canvas ref
  useEffect(() => {
    if (canvasRef.current && todayData.length && dateIndex < countyData.length) {
      const gl = canvasRef.current.getContext('webgl');
      mainRegl(gl, todayData, pointWidth, width, height)
        .then(() => {
          dispatch(dispatchDateIndex(dateIndex + 1));
        });
    } else if (canvasRef.current && !todayData.length && dateIndex < countyData.length) {
      d3.timeout(() => {
        dispatch(dispatchDateIndex(dateIndex + 1));
      }, 1000)
    }
  }, [canvasRef.current, dateIndex])

  return (
    <canvas
      className="DataPoints"
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
};

export default DataPoints;
