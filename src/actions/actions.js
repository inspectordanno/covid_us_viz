export const setDay = (day) => ({
  type: 'SET_DAY',
  day
})

export const setSkyBbox = (bbox) => ({
  type: 'SET_SKY_BBOX',
  bbox
})

export const increaseNewMeasure = (fips) => ({
  type: 'INCREASE_NEW_MEASURE',
  fips
})