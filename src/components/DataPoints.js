import React, { useState, useRef } from 'react';
import { useEffect } from 'react';

const DataPoints = ({ skyBbox }) => {

  const canvasContainer = useRef();
  const [skyPoints, setSkyPoints] = useState();

  //creating [x, y] position of every single point in the "sky"
  const populateSkyPoints = (skyBbox) => {
    const skyPointPositions = [];
    //x position
    for (let x = skyBbox.left; x < skyBbox.right; x++) {
      //y position
      for (let y = skyBbox.top; y < skyBbox.bottom; y++) {
        skyPointPositions.push([x, y]);
      }
    }
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