const reducerDefaultState = {
  dateIndex: 0,
  dateIncrement: true,
  domain: [1, 10, 100, 1000, 10000, 100000]
}

export default (state = reducerDefaultState, action) => {
  switch (action.type) {
    case 'DATE_INDEX':
      return {
        ...state,
        dateIndex: action.dateIndex
      }
    case 'DATE_INCREMENT':
      return {
        ...state,
        dateIncrement: action.dateIncrement
      }
    case 'DOMAIN':
      return {
        ...state,
        domain: action.domain
      }
    default: 
      return state;
  }
};