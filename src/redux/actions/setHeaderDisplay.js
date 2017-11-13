import * as actionTypes from '../actiontypes';

function setHeaderDisplay(display='normal'){
    return (dispatch) => {
      dispatch({type:actionTypes.setHeaderDisplay,display});
    }
}
export default setHeaderDisplay;
