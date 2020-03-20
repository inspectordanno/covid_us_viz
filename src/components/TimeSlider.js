import React, { useEffect } from 'react';
import { Slider } from '@material-ui/core';
import { min, max } from 'd3-array';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { quantile } from 'simple-statistics';

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

  //calculates the mark values (quantiles) for the slider
  const calculateQuantiles = (daysArray, lengthofReturnedArray) => {
    const quantiles = [0]; //starting out with array of first quantile, 0
    const spaceBetweenQuantiles = 1 / (lengthofReturnedArray - 1);
    let accumulator = 0;

    //while accumulator is below one, add quantile to accumulator and pust that value to the quantile array
    while (accumulator < 1) {
      accumulator += Math.round(spaceBetweenQuantiles * 1000) / 1000; //rounds to thousandths place
      
      if (accumulator <= 1) {
        quantiles.push(accumulator);
      } 
    };

    quantiles.sort(); //sorts quantiles from least to greatest

    const breaks = quantiles.map(currentQuantile => {
      return quantile(daysArray, currentQuantile); //for each quantile, find the result in the days array
    });

    return breaks;
  }

  const quantileValues = calculateQuantiles(days, 5);

  const marks = quantileValues.map(value => {
    return {
      value,
      label: valueLabelFormat(value)
    }
  });

  return (
    <Slider 
      min={min(days)}
      max={max(days)}
      onChange={handleOnChange}
      valueLabelDisplay="auto"
      valueLabelFormat={valueLabelFormat}
      marks={marks}
    />
  );
}

export default TimeSlider;