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
    default: 
      return state;
  }
};