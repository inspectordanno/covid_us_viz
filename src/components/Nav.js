import React from 'react';

import Dropdowns from './Dropdowns';

const Nav = ({ countyData, dateIndex }) => {
  return (
    <div className="Nav">
      <Dropdowns countyData={countyData} dateIndex={dateIndex} />
    </div>
  )
}

export default Nav;