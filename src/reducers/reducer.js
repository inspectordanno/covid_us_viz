const reducerDefaultState = {
  dateIndex: 0,
  autoDateIncrement: true
}

export default (state = reducerDefaultState, action) => {
  switch (action.type) {
    case 'UPDATE_DATE_INDEX':
      return {
        ...state,
        dateIndex: action.dateIndex
      }
    case 'AUTO_DATE_INCREMENT':
      return {
        ...state,
        autoDateIncrement: action.autoDateIncrement
      }
    default: 
      return state;
  }
};