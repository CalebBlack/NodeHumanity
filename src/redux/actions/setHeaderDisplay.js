import {setHeaderDisplay} from '../actiontypes';

function setHeaderDisplay(display='normal'){
    return (dispatch) => {
      dispatch({type:setHeaderDisplay,display});
    }
}
export default setHeaderDisplay;
