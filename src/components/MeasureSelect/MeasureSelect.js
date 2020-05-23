import React from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import { dispatchMeasure } from '../../actions/actions';
import { reducerDefaultState } from '../../reducers/reducer';

const MeasureSelect = () => {

  const dispatch = useDispatch();

  const options = [
    { value: 'newCases', label: 'New cases' },
    { value: 'newDeaths', label: 'New deaths' },
    { value: 'totalCases', label: 'Cumulative cases' },
    { value: 'totalDeaths', label: 'Cumulative deaths'}
  ];

  const defaultOption = options.find(option => option.value === reducerDefaultState.measure);

  const handleOnChange = (option) => {
    dispatch(dispatchMeasure(option.value));
  }

  return (
    <Select 
      className={'select'}
      options={options}
      defaultValue={defaultOption}
      onChange={handleOnChange}
    />
  )
}

export default MeasureSelect;