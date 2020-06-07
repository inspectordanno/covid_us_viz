import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { greatest } from 'd3-array';

import styles from '../../styles/Select.module.scss';

import { selectColorStyles } from '../../util/colors'
import stateFipsDict from '../../data/name_fips_pop.json';
import { dispatchCounty } from '../../actions/actions';

const CountySelect = ({ countyData, UsState }) => {

  const dispatch = useDispatch();

  const [selectValue, setSelectValue] = useState(); //default county

  //when a new state is selected, set input to random county of that state and dispatch to store
  useEffect(() => {
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    //get random or most populous county county
    const counties = stateFipsDict[UsState];
    const validCounties = counties.filter(county => countyData.has(county.fips));
    const mostPopCounty = greatest(validCounties, d => d.pop_2019);
    const randomCounty = getRandomElement(validCounties)

    setSelectValue({ value: mostPopCounty.fips, label: mostPopCounty.countyName });
    dispatch(dispatchCounty(mostPopCounty)); //or randomCounty
    
  },[UsState])

  const counties = stateFipsDict[UsState];
  const validCounties = counties.filter(county => countyData.has(county.fips));
  const options = validCounties.map(county => ({ value: county.fips, label: county.countyName }));

  //when select box is changed, set value and dispatch to store
  const handleOnChange = (option) => {
    setSelectValue(option);
    dispatch(dispatchCounty({ countyName: option.label, fips: option.value  }));
  }

  return (
    <Select
      className={styles.Select}
      options={options}
      onChange={handleOnChange}
      value={selectValue}
      styles={selectColorStyles}
    />
  )
}

export default CountySelect;