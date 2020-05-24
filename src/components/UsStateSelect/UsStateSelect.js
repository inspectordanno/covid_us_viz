import React, { useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import stateFipsDict from '../../data/state_fips_dict.json';
import { dispatchUsState } from '../../actions/actions';
import { reducerDefaultState } from '../../reducers/reducer';

const UsStateSelect = ({ UsState }) => {

  const dispatch = useDispatch();

  const [selectValue, setSelectValue] = useState({ value: UsState, label:UsState }); //set default state

  const UsStates = Object.keys(stateFipsDict).map(state => ({ value: state, label: state }));

  const handleOnChange = (option) => {
    setSelectValue(option);
    dispatch(dispatchUsState(option.value));
  }

  return (
    <Select
      className={'select'}
      options={UsStates}
      onChange={handleOnChange}
      value={selectValue}
    />
  )
} 

export default UsStateSelect;
