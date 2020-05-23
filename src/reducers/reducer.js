import stateFipsDict from '../data/state_fips_dict.json';

// const randomProperty = (obj) => {
//   const keys = Object.keys(obj);
//   return keys[keys.length * Math.random() << 0];
// };

// const randomState = randomProperty(stateFipsDict);
// const randomCounties = stateFipsDict[randomState];
// export const randomCounty = randomCounties[[Math.floor(Math.random() * randomCounties.length)]];

export const reducerDefaultState = {
  // dateIndex: 0,
  // dateIncrement: true, //true, false
  UsState: 'New York',
  countyFips: 'nyc',
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
    case 'US_STATE':
      return {
        ...state,
        UsState: action.UsState
      }
    case 'COUNTY_FIPS':
      return {
        ...state,
        countyFips: action.countyFips
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