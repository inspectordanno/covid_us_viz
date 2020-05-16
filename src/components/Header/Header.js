import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';

import Legend from '../Legend/Legend';
import Figure from '../Figure/Figure';

const Header = ({ countyData, dateIndex }) => {

  const measureType = [
    { value: 'total', label: 'Total' },
    { value: 'new', label: 'New' },
    { value: 'percentChange', label: 'Percent change from a week before'}
  ]

  const measure = [
    { value: 'cases', label: 'Cases' },
    { value: 'deaths', label: 'Deaths' },
  ]

  return (
    <div className='Header'>
        <Select className="category_select" options={measure} />
        <Select className="category_select" options={measureType}/>
        <DatePicker classname="date_picker" />
        <Legend />
        <Figure />
    </div>
  );
};

export default Header;
