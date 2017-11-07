import React from 'react';
import './card.less';

class Card extends React.Component {
  render(){
    return (
      <div className={'card '+this.props.color}>
        <p className='text'>{this.props.text}</p>
      </div>
    );
  }
}
Card.defaultProps = {
  color: 'white',
  text: ''
};

export default Card;
