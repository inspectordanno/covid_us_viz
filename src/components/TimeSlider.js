import React, { useState, useEffect } from 'react';
import { Slider } from '@material-ui/core';
import { min, max } from 'd3-array';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { quantile } from 'simple-statistics';
import intersection from 'lodash/intersection';

import { setDay } from '../actions/actions';

const TimeSlider = ({ stateData, countyData }) => {

  //gets numeric days
  const getDays = (municipalData) => {
    return municipalData.map(entry => {
      const day = entry.date.dayOfYear();
      return day;
    });
  }

  //find intersection of arrays so there are no gaps between state and county data
  const days = intersection(getDays(stateData), getDays(countyData));

  const dispatch = useDispatch();
  const [dayState, setDayState] = useState(min(days));
  const [stopped, setStopped] = useState(false);

  const valueLabelFormat = (value) => {
    //fixes bug where first value of slider is NaN until slider is clicked
    if (isNaN(value)) {
      value = min(days);
    }
    return moment(value, 'DDD DDDD').format('MMM D');
  }

  //calculates the mark values (quantiles) for the slider
  const calculateQuantiles = (daysArray, lengthOfBreaksArray) => {
    const quantiles = [0]; //starting out with array of first quantile, 0
    const spaceBetweenQuantiles = 1 / (lengthOfBreaksArray - 1);
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

  //timer which animates the slider
  useEffect(() => {
    const interval = setInterval(() => {
      setDayState(dayState => dayState + 1);
      dispatch(setDay(dayState));
    }, 100);
    //when last day is reached, stop timer
    //or
    //when slider is stopped (clicked), stop timer
    //this is running clearInterval multiple times but haven't found a fix around this at the moment, oh well
    if (dayState === max(days) || stopped) {
      console.log('stopped');
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  },[dayState, stopped])

  const handleOnChange = (event, value) => {
    //if slider has not been stopped, set stopped to true
    if (!stopped) {
      setStopped(true);
    }
    //set dayState to value of the slider instead of the timer setting it
    setDayState(value);
    dispatch(setDay(value));
  }

  return (
    <Slider 
      value={dayState}
      orientation="vertical"
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