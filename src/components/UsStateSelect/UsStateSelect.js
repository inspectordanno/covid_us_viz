import React, { useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import styles from '../../styles/select.module.scss';

import colors from '../../util/colors'
import stateFipsDict from '../../data/name_fips_pop.json';
import { dispatchUsState } from '../../actions/actions';

const UsStateSelect = ({ UsState }) => {

  const dispatch = useDispatch();

  const [selectValue, setSelectValue] = useState({ value: UsState, label: UsState }); //set default state

  const UsStates = Object.keys(stateFipsDict).map(state => ({ value: state, label: state }));

  const handleOnChange = (option) => {
    setSelectValue(option);
    dispatch(dispatchUsState(option.value));
  }

  const colorStyles = {
    menu: (styles) => ({
      ...styles,
      backgroundColor: colors.darkblue
    }),
    singleValue: (styles) =>({
      ...styles,
      color: 'white'
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: colors.darkblue
    })
  }

  return (
    <Select
      className={styles.Select}
      options={UsStates}
      onChange={handleOnChange}
      value={selectValue}
      styles={colorStyles}
    />
  )
} 

export default UsStateSelect;
