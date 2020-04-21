export const setDay = (day) => ({
  type: 'SET_DAY',
  day
})

export const setSkyBbox = (bbox) => ({
  type: 'SET_SKY_BBOX',
  bbox
})

const updateMeasure = (measure) => ({
  type: 'UPDATE_MEASURE',
  fips,
  measure
})

export const updateMeasureThunk = (coordinates, measure) => {
  return (dispatch, getState) => {
    //get measure object from state
    const { measure } = getState();

    //if fips is in thunk, increase. otherwise, set equal to 1
    measure[coordinates] ? measure[coordinates] += 1 : measure[coordinates] = 1;

    dispatch(updateMeasure());

    //continue working on thunk!
  }
}

const increaseNewMeasureThunk 