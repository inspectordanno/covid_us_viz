import { mean } from 'd3-array';

//windowLength must be odd
export const getMovingAverage = (arr, windowLength) => {
  const averages = [];
  const lastIndex = arr.length - 1;

  //windowHalf is one half of the window, minus the middle
  //e.x. windowLength === 7; windowHalf === 3;
  const windowHalf = Math.floor(windowLength / 2);  
  let windowFirst = 0;
  let windowLast = windowLength - 1;
  const windowValues = arr.slice(windowFirst, windowLast + 1);

  const pushAverage = () => {
    const average = Math.round(mean(windowValues));
    averages.push(average);
  } 

  arr.forEach(() => {
    if (windowFirst < windowHalf) {
      pushAverage();
      windowFirst += 1;
      windowLast -= 1;
      console.log(windowFirst, windowLast);
    } else if (windowFirst > windowHalf && windowLast < lastIndex - windowHalf) {
      pushAverage();
      windowFirst += 1;
      windowLast += 1;
      console.log(windowFirst, windowLast);
    } else if (windowLast > lastIndex - windowHalf) {
      pushAverage();
      windowFirst -= 1;
      windowLast += 1;
    }
  });

  return averages;
}