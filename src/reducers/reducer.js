const reducerDefaultState = {

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
    default: 
      return state;
  }
};