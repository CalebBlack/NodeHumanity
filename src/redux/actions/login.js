import * as loginStatuses from '../loginstatuses';
import {setLoginStatus} from '../actiontypes';

export function login(username,password) {
  return dispatch=>{
    dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggingIn});
  }
}
