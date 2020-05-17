const reducerDefaultState = {
  dateIndex: 0,
  dateIncrement: true, //true, false
  measure: 'totalCases' //totalCases, totalDeaths, newCases, newDeaths, percentChangeCases, percentChangeDeaths
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
    case 'MEASURE': 
      return {
        ...state,
        measure: action.measure
      }
    default: 
      return state;
  }
};