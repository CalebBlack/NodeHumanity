import * as actionTypes from './actiontypes';
const initialState = {}

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch(action.type) {
    case actionTypes.setCardDatabase:
      return Object.assign({},state,{cards:action.cards,blackCards:action.cards.blackCards,whiteCards:action.cards.whiteCards});
    default:
      return state;
  }
}
export default reducer;
