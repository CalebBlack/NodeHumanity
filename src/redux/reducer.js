import * as actionTypes from './actiontypes';
const initialState = {}

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch(action.type) {
    case actionTypes.setCardDatabase:
      return Object.assign({},state,{cards:action.cards});
    default:
      return state;
  }
}
export default reducer;
