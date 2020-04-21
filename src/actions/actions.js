export const setDate = (date) => ({
  type: 'SET_DATE',
  date
})

export const setSkyBbox = (bbox) => ({
  type: 'SET_SKY_BBOX',
  bbox
})

const updateCountyFrequency = (countyFrequencies) => ({
  type: 'UPDATE_COUNTY_FREQUENCY',
  countyFrequencies
})

export const updateCountyFrequencyThunk = (coordinates) => {
  return (dispatch, getState) => {
    //get countyFrequency object from state
    const { countyFrequencies } = getState();

    //if coordinates array is in thunk, increase. otherwise, set equal to 1
    countyFrequencies[coordinates] ? countyFrequencies[coordinates] += 1 : countyFrequencies[coordinates] = 1;

    //update reducer
    dispatch(updateCountyFrequency(countyFrequencies));
  }
};