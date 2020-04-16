import React from 'react';
import { useEffect } from 'react';

const DataPoints = ({width, height}) => {


  return (
    <canvas
      className='DataPoints'
      width={width}
      height={height}
    >
    </canvas>
  )
}

export default DataPoints;