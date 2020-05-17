import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';

import { header, categorySelect, measure, measureType, datePicker, legend, figure } from './header.module.scss';
import Legend from '../Legend/Legend';
import Figure from '../Figure/Figure';
import { useSelector } from "react-redux";

const Header = ({ dateIndex, dateMap, domain }) => {

  const domain = useSelector(state => state.domain);

  const measureTypeOpts = [
    { value: 'total', label: 'Total' },
    { value: 'new', label: 'New' },
    { value: 'percentChange', label: 'Percent change from a week before'}
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
        <Legend domain={domain} />
        <Figure />
    </div>
  )
}

export default Header;
