import React from 'react';
import { useSelector } from 'react-redux';

import USMap from './USMap';

const CovidApp = () => {

  return (
    <div className="CovidApp">
      <USMap />
    </div>
  );
}

export default CovidApp;