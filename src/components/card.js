import React from 'react';
import './card.less';

class Card extends React.Component {
  render(){
    return (
      <div onClick={this.props.onClick || null} className={'card '+this.props.color+' '+this.props.className}>
        <p className='text' dangerouslySetInnerHTML={{__html:this.props.text}}></p>
        {this.props.children || null}
      </div>
    )
  }
}
Card.defaultProps = {
  color: 'white',
  text: ''
};

export default Card;
