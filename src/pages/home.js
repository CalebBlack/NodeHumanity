import React from 'react';
import './home.less';
import Card from '../components/card';

class Home extends React.Component {
  render() {
    return (
      <div className='home'>
        <h1 className='title'>Cards Against Humanity</h1>
        <Card color='black' text='one time I ate a whole horse'/>
      </div>
    );
  }
}
export default Home
