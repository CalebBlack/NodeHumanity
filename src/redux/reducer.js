import * as actionTypes from './actiontypes';
import * as loginStatuses from './loginstatuses';
const initialState = {loggedIn:false,loginStatus:loginStatuses.uninitialized,headerDisplay:'normal'};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch(action.type) {
    case actionTypes.setLoginStatus:
      return Object.assign({},state,{loggedIn:action.loginStatus === loginStatuses.loggedIn, loginStatus:action.loginStatus});
    case actionTypes.setCardDatabase:
      return Object.assign({},state,{cards:action.cards,blackCards:action.cards.blackCards,whiteCards:action.cards.whiteCards});
    case actionTypes.setHeaderDisplay:
      return Object.assign({},state,{headerDisplay:action.display});
    default:
      return state;
  }
}
export default reducer;
