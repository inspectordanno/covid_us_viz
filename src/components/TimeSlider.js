import React, { useEffect } from 'react';
import { Slider } from '@material-ui/core';
import { min, max } from 'd3-array';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { setDay } from '../actions/actions';

const TimeSlider = ({ nationalData }) => {

  const dispatch = useDispatch();

  //on mount, gets first day and sends it to store
  useEffect(() => {
    const firstDay = nationalData[0].date.dayOfYear();
    dispatch((setDay(firstDay)));
  }, [])

  const days = nationalData.map(entry => {
    const day = entry.date.dayOfYear();
    return day;
  });

  const valueLabelFormat = (value) => {
    //fixes bug where first value of slider is NaN until slider is clicked
    if (isNaN(value)) {
      value = min(days);
    }
    return moment(value, 'DDD DDDD').format('MMM D');
  }

  const handleOnChange = (event, value) => {
    dispatch(setDay(value));
  }

  return (
    <Slider 
      min={min(days)}
      max={max(days)}
      onChange={handleOnChange}
      valueLabelDisplay="auto"
      valueLabelFormat={valueLabelFormat}
    />
  );
}

export default TimeSlider;