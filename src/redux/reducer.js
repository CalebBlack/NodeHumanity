import * as actionTypes from './actiontypes';
import * as loginStatuses from './loginstatuses';
const initialState = {loggedIn:false,loginStatus:loginStatuses.uninitialized};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch(action.type) {
    case actionTypes.setLoginStatus:
      return Object.assign({},state,{loggedIn:action.loginStatus === loginStatuses.loggedIn, loginStatus:action.loginStatus});
    case actionTypes.setCardDatabase:
      return Object.assign({},state,{cards:action.cards,blackCards:action.cards.blackCards,whiteCards:action.cards.whiteCards});
    default:
      return state;
  }
}
export default reducer;
