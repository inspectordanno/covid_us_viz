import React from 'react';
import { Slider } from '@material-ui/core';
import { min, max } from 'd3-array';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

const TimeSlider = ({ nationalData }) => {

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

  return (
    <Slider 
      min={min(days)}
      max={max(days)}
      valueLabelDisplay="auto"
      valueLabelFormat={valueLabelFormat}
    />
  );
}

export default TimeSlider;