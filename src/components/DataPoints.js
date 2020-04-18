import React, { useState, useRef, Fragment } from 'react';
import * as d3 from 'd3';
import { useEffect } from 'react';

import { projection } from './UsMap';

const DataPoints = ({ countyData, day, skyBbox }) => {

  const canvasRef = useRef();
  const [skyPoints, setSkyPoints] = useState();

  const pointRadius = 5;

  //creating [x, y] position of every single point in the "sky"
  const populateSkyPoints = (skyBbox) => {
    const skyPointPositions = [];
    //center of circles [x, y] are (2 * radius) away from each other
    //Thus, each loop iteration increase is 2r

    //calculates x position of every point
    //first point is +radius away from the left, last point is -radius away from the right
    for (let x = skyBbox.left + pointRadius; x < skyBbox.right - pointRadius; x += pointRadius * 2) {
      //calculates y position of every point
      //first point is +radius away from the top, last point is -radius away from the bottom
      for (let y = skyBbox.top + pointRadius; y < skyBbox.bottom - pointRadius; y += pointRadius * 2) {
        skyPointPositions.push([x, y]);
      }
    }
    console.log(skyPointPositions);
    setSkyPoints(skyPointPositions);
  }

  //populates skyPoints
  useEffect(() => {
    if (skyBbox) {
      populateSkyPoints(skyBbox);
    }
  }, [skyBbox])

  useEffect(() => {
    if (canvasRef.current) {
      const currentDayData = countryData.get(day);
      const canvas = d3.select(canvasRef.current);
      const context = canvas.node().getContext('2d');
      const customBase = document.createElement('custom');
      const custom = d3.select(customBase);

      //continue d3 canvas stuff here
    }

  },[canvasRef.current])

  return skyPoints
  ?
  (
    <canvas
    className='DataPoints'
    width={window.innerWidth}
    height={window.innerHeight} 
    />
  )
  :
  null;
}

export default DataPoints;