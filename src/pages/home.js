import React from 'react';
import './home.less';
import Card from '../components/card';

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='home' ref={ref=>{if (!this.state.home){this.setState({home:ref})}}}>
        <h1 className='title'>Cards Against Humanity</h1>
        <Card color='white' text='one time I ate a whole ____'/>
      </div>
    );
  }
}
export default Home
