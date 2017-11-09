import React from 'react';
import './home.less';
import Card from '../components/card';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import randomBetween from '../functions/randombetween';
import HomeLink from '../components/homelink';

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render() {
    if (this.props.blackCards === undefined || this.props.blackCards === null || this.props.whiteCards === undefined || this.props.whiteCards === null ) return null;
    var blackCard = (<Card color='black' text={this.props.blackCards[randomBetween(0,this.props.blackCards.length - 1)].text}/>);
    var whiteCards = [0,0,0,0].map(()=>{return this.props.whiteCards[randomBetween(0,this.props.whiteCards.length - 1)]});
    whiteCards = whiteCards.map((card,index)=>{
      return (<Card key={index + 1} color='white' text={card}/>)
    });
    return (
      <div className='home' ref={ref=>{if (!this.state.home){this.setState({home:ref})}}}>
        <HomeLink/>
        <h1 className='title'>Cards Against Humanity</h1>
        <Link to='play' className='playbanner'>Play!</Link>
        <div className='top'>
        {blackCard}
        </div>
        <div className='bottom'>
        {whiteCards}
        </div>
      </div>
    );
  }
}

export default connect((state) => {
        return {whiteCards: state.whiteCards, blackCards: state.blackCards}
    })(Home);
