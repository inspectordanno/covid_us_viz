import React from "react";
import { useDispatch } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { format } from 'date-fns'

import { reducerDefaultState } from '../../reducers/reducer';
import { header, categorySelect, measure, measureType, datePicker, legend, figure } from './header.module.scss';
import Legend from '../Legend/Legend';
import Figure from '../Figure/Figure';
import { dispatchMeasure, dispatchDateIndex, dispatchDateIncrement } from '../../actions/actions';

const Header = ({ dateIndex, dateMap, measure }) => {

  const dispatch = useDispatch();

  const measureOptions = [
    { value: 'totalCases', label: 'Cumulative cases' },
    { value: 'totalDeaths', label: 'Cumulative deaths'},
    { value: 'newCases', label: 'New cases' },
    { value: 'newDeaths', label: 'New deaths' },
    // { value: 'percentChangeCases', label: 'Percent change in new cases from a week before'},
    // { value: 'percentChangeDeaths', label: 'Percent change in new deaths from a week before'}
  ];

  const onDateChange = (date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    console.log(formatted);
    const index = dateMap[formatted];
    dispatch(dispatchDateIncrement(false));
    dispatch(dispatchDateIndex(index));
  }

  return (
    <div className={header}>
        <Select 
          options={measureOptions} 
          defaultValue={measureOptions.find(option => option.value === reducerDefaultState.measure)} 
          onChange={(selectedOption) => dispatch(dispatchMeasure(selectedOption.value))}/>
        <DatePicker className={datePicker} onChange={onDateChange}/>
        <Legend measure={measure} />
        <Figure />
    </div>
  )
}

export default Header;
