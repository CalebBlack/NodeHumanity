import React from 'react';

class Game extends React.Component {
  render(){
    return(
      <p>#{this.props.room}</p>
    );
  }
}
export default Game;
