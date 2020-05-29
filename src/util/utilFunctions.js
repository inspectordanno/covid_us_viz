import { mean } from 'd3-array';

//centered moving average
//windowLength must be odd
export const getMovingAverage = (arr, windowLength) => {
  const averages = [];
  const lastIndex = arr.length - 1;

  //windowHalf is one half of the window, minus the middle
  //e.x. windowLength === 7; windowHalf === 3;
  const windowHalf = Math.floor(windowLength / 2);  
  let windowFirst = 0;
  let windowLast = windowLength - 1;
  
  const pushAverage = () => {
    const windowValues = arr.slice(windowFirst, windowLast + 1);
    const average = mean(windowValues);
    averages.push(average);
    // console.log(`windowFirst: ${windowFirst}`, `windowLast: ${windowLast}`);
    // console.log(windowValues);
  } 

  arr.forEach((d, i) => {
    if (i < windowHalf) {
      pushAverage();
    } else if (i >= windowHalf && windowLast <= lastIndex - windowHalf) {
      windowFirst = i - windowHalf;
      windowLast = i + windowHalf;
      pushAverage();
    } else if (windowLast > lastIndex - windowHalf) {
      pushAverage();
      windowFirst += 1;
      windowLast += 1;
    }
  });

  return averages;
}