import React, { useState, useRef } from 'react';
import { useEffect } from 'react';

const DataPoints = ({ skyBbox }) => {

  const canvasContainer = useRef();
  const [skyPoints, setSkyPoints] = useState();

  const pointRadius = 5;

  //creating [x, y] position of every single point in the "sky"
  const populateSkyPoints = (skyBbox) => {
    const skyPointPositions = [];
    //center of circle are 2r away from each other - increasing loop by 2r
    //x position
    for (let x = skyBbox.left; x < skyBbox.right; x += pointRadius * 2) {
      //y position
      for (let y = skyBbox.top; y < skyBbox.bottom; y += pointRadius * 2) {
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