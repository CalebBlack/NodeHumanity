import {setUser} from '../actiontypes';

export default (user)=>{
  dispatch => {
    dispatch({type:setUser,user});
  }
}
