const reducerDefaultState = {
  dateIndex: 0
}

export default (state = reducerDefaultState, action) => {
  switch (action.type) {
    case 'UPDATE_DATE_INDEX':
      return {
        ...state,
        dateIndex: action.dateIndex
      }
    case 'SET_BBOX':
      return {
        ...state,
        bbox: action.bbox
      }
    case 'LAST_POINT':
      return {
        ...state,
        lastPoint: action.lastPoint
      }
    default: 
      return state;
  }
};