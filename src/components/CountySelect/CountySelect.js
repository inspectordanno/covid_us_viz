import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import stateFipsDict from '../../data/state_fips_dict.json';
import { dispatchCountyFips } from '../../actions/actions';
import usePrevious from '../../hooks/usePrevious';

const CountySelect = ({ countyData, UsState }) => {

  const dispatch = useDispatch();
  const [selectValue, setSelectValue] = useState();
  const prevUsState = usePrevious(UsState);

  useEffect(() => {
    if (prevUsState !== UsState) {
      setSelectValue(null);
    } 
  },[UsState])

  const counties = stateFipsDict[UsState];
  const validCounties = counties.filter(county => countyData.has(county.fips));
  const options = validCounties.map(county => ({ value: county.fips, label: county.countyName }));

  const handleOnChange = (option) => {
    setSelectValue(option);
    dispatch(dispatchCountyFips(option.value));
  }

  return (
    <Select
      className={'select'}
      options={options}
      onChange={handleOnChange}
      value={selectValue}
      isClearable={true}
    />
  )
}

export default CountySelect;