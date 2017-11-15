import * as actionTypes from '../actiontypes';

export default function setUser(user){
  return dispatch => {
    dispatch({type:actionTypes.setUser,user});
  }
}
