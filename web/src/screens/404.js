import React from 'react';
import '../App.scss';

function NotFound() {
  return (
    <div style={{textAlign: 'center'}}>
      <header className={'NotFound'}>
        <img src={'https://i.redd.it/2bemokuji4631.jpg'} alt={''} style={{height: '18em'}}/>
        <p style={{color: '#252525', flex: 50}}>
          <h3>404</h3>
          why are you here?
        </p>
      </header>
    </div>
  )
}

export default NotFound