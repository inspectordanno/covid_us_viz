const reducerDefaultState = {

}

export default (state = reducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_DAY':
      return {
        ...state,
        day: action.day
      }
    default: 
      return state;
  }
};