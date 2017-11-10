import * as loginStatuses from '../loginstatuses';
import {setLoginStatus} from '../actiontypes';
import request from '../../functions/request';
import safeParse from '../../functions/safeParse';

export function login(username,password) {
  return dispatch=>{
    dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggingIn});
    request('/api/login','get',{auth:[username,password]}).then(response=>{
      let data = safeParse(response);
      if (data && data.session && data.session.id) localStorage.sessionID = data.session.id;
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
      let data = safeParse(response);
      if (data && data.session && data.session.id) localStorage.sessionID = data.session.id;
      dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggedIn});
    }).catch(err=>{
      dispatch({type:setLoginStatus,loginStatus:loginStatuses.failed});
    })
  }
}
export function initialize(){
  return dispatch=>{
    if (localStorage.sessionID) {
      request('/api/validateauth','get',{secure:true}).then(response=>{
        dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggedIn});
      }).catch(err=>{
        dispatch({type:setLoginStatus,loginStatus:loginStatuses.expired});
      });
    } else {
      dispatch({type:setLoginStatus,loginStatus:loginStatuses.loggedOut});
    }
  }
}
