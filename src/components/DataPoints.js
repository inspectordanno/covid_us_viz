import React, { useState, useRef } from 'react';
import { useEffect } from 'react';

const DataPoints = ({ skyBbox }) => {

  const canvasContainer = useRef();
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
    if (canvasContainer.current) {
      //canvas work here
    }

  },[canvasContainer.current])

  return skyBbox && skyPoints
  ?
  (
    <canvas
      className='DataPoints'
      width={window.innerWidth}
      height={window.innerHeight} 
      ref={canvasContainer} >
    </canvas>
  )
  :
  null;
}

export default DataPoints;