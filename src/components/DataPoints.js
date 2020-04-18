import React, { useState, useRef, Fragment } from 'react';
import * as d3 from 'd3';
import { useEffect } from 'react';
import shuffle from 'lodash/shuffle';

import { projection } from './UsMap';
import { transition } from 'd3';

const DataPoints = ({ countyData, day, skyBbox }) => {

  const canvasRef = useRef();
  const [skyPoints, setSkyPoints] = useState();

  const pointRadius = 5;

  //creating [x, y] position of every single point in the "sky"
  //aka the starting positions for the datapoints
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

  
  const joinStartPositions = (currentDayData) => {
    //shuffles the start positions array and assigns a start position for every covid datapoint
    const shuffledStartPositions = shuffle(skyPoints);
    return currentDayData.map((d, i) => {
      //we use the modulus to get which start position should be associated with the covid datapoint
      //if there are less covid points than start points, i is returned
      //if there are more more covid points than start points, it is as if we are "looping" through the
      //covid points, and each succession of the loop is associated with the start point again
      //startPosIndex = x % y 
      //where x is the index of the covid point array (i), and y is the length of the start point array (shuffledStartPositions.length)
      //first go around 1 % 6 === 1
      //second go around 7 % 6 === 1
      //third go around 13 % 6 === 1
      const startPosIndex = i % shuffledStartPositions.length;

      return {
        ...d,
        startX: shuffledStartPositions[startPosIndex][0],
        startY: shuffledStartPositions[startPosIndex][1]
      }
    });
  }
  

  //populates skyPoints
  useEffect(() => {
    if (skyBbox) {
      populateSkyPoints(skyBbox);
    }
  }, [skyBbox])

  useEffect(() => {
    if (canvasRef.current && skyPoints) {
      const currentDayData = countryData.get(day);
      const canvas = d3.select(canvasRef.current);
      const context = canvas.node().getContext('2d');
      const customBase = document.createElement('custom');
      const custom = d3.select(customBase);
      const joinedDayData = joinStartPositions(currentDayData);

      const dataBind = (joinedDayData) => {

        custom.selectAll('custom.dataPoint')
          .data(joinedDayData, (d,i) => `${d.date} ${i}`) //key is date plus index in the array
          .join('circle')
          .attr('x', d => d.startX)
          .attr('y', d => d.startY)
          .transition()
          .attr('x', d => projection(d.coordinates)[0])
          .attr('y', d => projection(d.coordinates)[1]);
    
          //continue canvas work here
      }
    }

  },[canvasRef.current, skyPoints])

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