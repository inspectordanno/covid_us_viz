import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';

import { header, categorySelect, measure, measureType, datePicker, legend, figure } from './header.module.scss';
import Legend from '../Legend/Legend';
import Figure from '../Figure/Figure';
import { useSelector } from "react-redux";

const Header = ({ dateIndex, dateMap, measure }) => {

  const measureOptions = [
    { value: 'totalCases', label: 'Total Cases' },
    { value: 'newCases', label: 'New Cases' },
    { value: 'totalDeaths', label: 'Total Deaths'},
    { value: 'newDeaths', label: 'New Deaths' },
    { value: 'percentChangeCases', label: 'Percent change in new cases from a week before'},
    { value: 'percentChangeDeaths', label: 'Percent change in new deaths from a week before'}
  ]

  const handleChange = (selectedOption) => {
    console.log(selectedOption)
  }

  return (
    <div className={header}>
        <Select options={measureOptions} onChange={handleChange}/>
        <DatePicker className={datePicker}/>
        <Legend measure={measure} />
        <Figure />
    </div>
  )
}

export default Header;
