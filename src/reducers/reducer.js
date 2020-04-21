const reducerDefaultState = {
  countyFrequencies : {}
}

export default (state = reducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_DATE':
      return {
        ...state,
        date: action.date
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