import * as loginStatuses from '../loginstatuses';
import {setLoginStatus} from '../actiontypes';
import request from '../../functions/request';

export function login(username,password) {
  return dispatch=>{
    dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggingIn});
    request('/api/login','get',{auth:[username,password]}).then(response=>{
      dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggedIn});
    }).catch(err=>{
      dispatch({type:setLoginStatus,loginStatus:loginStatuses.failed});
    });
  }
}
export function signup(username,password,email) {
  return dispatch=>{
    dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggingIn});
    request('/api/signup','post',{auth:[username,password],body:{email}}).then(response=>{
      dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggedIn});
    }).catch(err=>{
      dispatch({type:setLoginStatus,loginStatus:loginStatuses.failed});
    })
  }
}
