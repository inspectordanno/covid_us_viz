import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import stateFipsDict from '../../data/state_fips_dict.json';
import { dispatchCountyFips } from '../../actions/actions';

const CountySelect = ({ countyData, UsState, countyFips }) => {

  const dispatch = useDispatch();

  const defaultFips = stateFipsDict[UsState].find(d => d.fips === countyFips);

  const [selectValue, setSelectValue] = useState(defaultFips); //default county

  //when a new state is selected, set input to random county of that state and dispatch to store
  useEffect(() => {
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    //get random county
    const counties = stateFipsDict[UsState];
    const validCounties = counties.filter(county => countyData.has(county.fips));
    const randomCounty = getRandomElement(validCounties)

    setSelectValue({ value: randomCounty.fips, label: randomCounty.countyName });
    dispatch(dispatchCountyFips(randomCounty.fips));
    
  },[UsState])

  const counties = stateFipsDict[UsState];
  const validCounties = counties.filter(county => countyData.has(county.fips));
  const options = validCounties.map(county => ({ value: county.fips, label: county.countyName }));

  //when select box is changed, set value and dispatch to store
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
    />
  )
}

export default CountySelect;