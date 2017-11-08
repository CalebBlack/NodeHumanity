import * as loginStatuses from '../loginstatuses';
import {setLoginStatus} from '../actiontypes';
import request from '../../functions/request';

export function login(username,password) {
  return dispatch=>{
    dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggingIn});
    request('/api/login',null,{auth:[username,password]}).then(response=>{
      console.log(response);
      dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggedIn});
    }).catch(err=>{
      console.log(error);
      dispatch({type:setLoginStatus,loginStatus:loginStatuses.failed});
    });
  }
}
