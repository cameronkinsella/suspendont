import React from 'react';
import Lottie from '../components/Lottie';
import animation from '../assets/loader.json';
import {useHistory} from 'react-router-dom';

export default function Reload(props) {

  const history = useHistory();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return props.loading ? (
    <div className="loader">
      <Lottie
        options={defaultOptions}
        height={400}
        width={400}
      />
      <div className="pleaseWait">
        <b>
          Please wait... This may take a moment.
        </b>
      </div>
    </div>
  ) : (

    <div className='reload'>
      <div className='returnMain'>
        <b>
          You've requested too many times, please try again later!
        </b>
      </div>

    </div>

  )
}