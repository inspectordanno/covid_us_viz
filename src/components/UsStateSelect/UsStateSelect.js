import React from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import stateFipsDict from '../../data/state_fips_dict.json';
import { dispatchUsState } from '../../actions/actions';
import { reducerDefaultState } from '../../reducers/reducer';

const UsStateSelect = () => {

  const dispatch = useDispatch();

  const UsStates = Object.keys(stateFipsDict).map(state => ({ value: state, label: state }));

  const handleOnChange = (option) => {
    dispatch(dispatchUsState(option.value));
  }

  return (
    <Select
      options={UsStates}
      onChange={handleOnChange}
      defaultValue={reducerDefaultState.UsState} 
    />
  )
} 

export default UsStateSelect;
