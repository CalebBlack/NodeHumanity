import {setCardDatabase} from '../actiontypes';
import request from '../../functions/request';

function getCardDatabase(){
    return async (dispatch) => {
      if (!localStorage.database) localStorage.database = await request('cards.json');
      dispatch({type:setCardDatabase,cards:JSON.parse(localStorage.database)});
    }
}
export default getCardDatabase;
