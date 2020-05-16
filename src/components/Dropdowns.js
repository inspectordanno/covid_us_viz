import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';

const Dropdowns = ({ countyData, dateIndex }) => {

  const optionsOne = [
    { value: 'total', label: 'Total' },
    { value: 'new', label: 'New' },
    { value: 'percentChange', label: 'Percent change from a week before'}
  ]

  const optionsTwo = [
    { value: 'cases', label: 'Cases' },
    { value: 'deaths', label: 'Deaths' },
  ]

  return (
    <div className='Dropdowns'>
      <div className='Dropdowns__categories'>
        <Select className="category_select" options={optionsTwo} />
        <Select className="category_select" options={optionsOne}/>
      </div>
      <span>United States</span>
      <DatePicker />
    </div>
  );
};

export default Dropdowns;
