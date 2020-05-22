import React from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import stateFipsDict from '../../data/state_fips_dict.json';
import { dispatchCountyFips } from '../../actions/actions';
import { reducerDefaultState } from '../../reducers/reducer';

const CountySelect = ({ UsState }) => {

  const dispatch = useDispatch();

  const counties = stateFipsDict[UsState];
  const options = counties.map(county => ({ value: county.fips, label: county.countyName }));

  const handleOnChange = (option) => {
    dispatch(dispatchCountyFips(option.value));
  }

  return (
    <Select
      options={options}
      onChange={handleOnChange}
      defaultValue={reducerDefaultState.countyFips}
    />
  )
}

export default CountySelect;