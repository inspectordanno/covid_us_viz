import React from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import stateFipsDict from '../../data/state_fips_dict.json';
import { dispatchCountyFips } from '../../actions/actions';
// import { randomCounty } from '../../reducers/reducer';

const CountySelect = ({ countyData, UsState }) => {

  const dispatch = useDispatch();

  const counties = stateFipsDict[UsState];
  const validCounties = counties.filter(county => countyData.has(county.fips));

  const options = validCounties.map(county => ({ value: county.fips, label: county.countyName }));

  const handleOnChange = (option) => {
    dispatch(dispatchCountyFips(option.value));
  }

  return (
    <Select
      className={'select'}
      options={options}
      onChange={handleOnChange}
    />
  )
}

export default CountySelect;