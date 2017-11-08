import React from 'react';
import Background from '../components/background';
import {connect} from 'react-router-dom';

class Game extends React.Component {
  render(){
    return (
    <div id='game'>
      <Background/>
    </div>
  );
  }
}
export default connect(state=>{
  return {loginStatus:state.loginStatus}
})(Game);
