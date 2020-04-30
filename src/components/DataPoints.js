import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as d3 from "d3";

import mainRegl from '../webgl/regl';
import { dispatchDateIndex } from "../actions/actions";
import albersProjection from "../util/albersProjection";

const DataPoints = ({ countyData, dateIndex, setDateIndex, width, height }) => {
  const [prevPoints, setPrevPoints] = useState([]);
  const canvasRef = useRef();
  const dispatch = useDispatch();

  const todayData = countyData[dateIndex][1];
  const projection = albersProjection(width, height);

  const calculateStartPoints = () => {
    const x = d3.randomUniform(0, width + 1)();
    const y = d3.randomUniform(0, height + 1)();
    return [x, y];
  };

  const calculateNewData = (measure) => {
    const newData = [];

    todayData.forEach((d) => {
      //repeat for every new case/death
      let timesToRepeat = d[measure];

      const totalMeasure =
        measure === "newCases" ? "totalCases" : "totalDeaths";

      const startPoints = calculateStartPoints();
      const endPoints = projection(d.coordinates);

      while (timesToRepeat) {
        newData.push({
          date: d.date,
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
    return newData;
  };

  const todayNewData = calculateNewData("newCases"); //choose 'newCases' or 'newDeaths'
  const cumData = [...prevPoints, ...todayNewData];

  const pointsAnimated = new Promise((resolve, reject) => {

  })

  //creating regl instance with canvas ref
  useEffect(() => {
    const asyncDrawPoint = async () => {
      if (canvasRef.current) {
        const gl = canvasRef.current.getContext('webgl');
        mainRegl(gl, dateIndex, todayNewData, width, height);
        console.log('done');
        // dispatch(dispatchDateIndex(dateIndex + 1));
      }
    }
    asyncDrawPoint();
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
