import React from 'react';

export default class Navbar extends React.Component {

  render() {
    return (
      <>
      {/* refactor down the line */}
        <header className='navbar'>
          <div className='container'>
              <div className='col-full row align-center'>
                <a><h2 className='logo'>Fun-2-Learn</h2></a>
                <img className='penguin' src='./images/pengoo.png'></img>
              </div>
          </div>
        </header>
      </>
    );
  }
}