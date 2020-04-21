const reducerDefaultState = {
  countyFrequencies : {}
}

export default (state = reducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_DAY':
      return {
        ...state,
        day: action.day
      }
    case 'SET_SKY_BBOX':
      return {
        ...state,
        skyBbox: action.bbox
      }
    case 'UPDATE_COUNTY_FREQUENCY':
      return {
        ...state,
        countyFrequencies: action.countyFrequencies
      }
    default: 
      return state;
  }
};