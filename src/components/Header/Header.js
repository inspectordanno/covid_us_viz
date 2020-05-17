import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';

import { header, categorySelect, measure, measureType, datePicker, legend, figure } from './header.module.scss';
import Legend from '../Legend/Legend';
import Figure from '../Figure/Figure';
import { useSelector } from "react-redux";

const Header = ({ dateIndex, dateMap }) => {

  const measureTypeOpts = [
    { value: 'totalCases', label: 'Total Cases' },
    { value: 'newCases', label: 'New Cases' },
    { value: 'totalDeaths', label: 'Total Deaths'},
    { value: 'newDeaths', label: 'New Deaths' },
    { value: 'percentChangeCases', label: 'Percent change in new cases from a week before'},
    { value: 'percentChangeDeaths', label: 'Percent change in new deaths from a week before'}
  ]

  const measureOpts = [
    { value: 'cases', label: 'Cases' },
    { value: 'deaths', label: 'Deaths' },
  ]

  return (
    <div className={header}>
        <Select 
          className={`${categorySelect}, ${measure}`} 
          options={measureOpts} />
        <Select 
          className={`${categorySelect}, ${measureType}`} 
          options={measureTypeOpts}/>
        <DatePicker className={datePicker}/>
        <Legend />
        <Figure />
    </div>
  )
}

export default Header;