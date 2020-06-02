export const reducerDefaultState = {
  UsState: '',
  county: '',
  measure: 'newCases' //totalCases, totalDeaths, newCases, newDeaths, percentChangeCases, percentChangeDeaths
}

export default (state = reducerDefaultState, action) => {
  switch (action.type) {
    case 'US_STATE':
      return {
        ...state,
        UsState: action.UsState
      }
    case 'COUNTY':
      return {
        ...state,
        county: action.county
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