export const getMovingAverage = (arr, windowLength) => {
  const averages = [];
  const lastIndex = arr.length - 1;
  let windowFirst = 0;
  let windowLast = windowLength - 1;
  const windowValues = arr.slice(windowFirst, windowLast + 1);

  const pushAverage = () => {
    const average = Math.round(mean(windowValues));
    averages.push(average);
  } 

  return arr.forEach(() => {
    if (windowFirst < Math.floor(windowLength / 2)) {
      pushAverage();
      windowFirst += 1;
      windowLast -= 1;
      console.log(windowFirst, windowLast);
    } else if (windowFirst > Math.floor(windowLength / 2) && windowLast < lastIndex - Math.floor(windowLength / 2)) {
      pushAverage();
      windowFirst += 1;
      windowLast += 1;
      console.log(windowFirst, windowLast);
    } else if (windowLast > lastIndex - Math.floor(windowLength / 2)) {
      pushAverage();
      
    }
  });
}