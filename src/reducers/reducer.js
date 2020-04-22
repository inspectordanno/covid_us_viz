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
    default: 
      return state;
  }
};