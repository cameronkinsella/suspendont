import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-regular-svg-icons';
import Lottie from './Lottie';
import white from '../assets/loader-white.json';
import black from '../assets/loader-black.json';

export default function Refresh(props) {
  const [animation] = useState(props.darkMode ? white : black);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return props.error ? (
    <div className="refresh">
      <FontAwesomeIcon icon={faFrown} size="6x"/>
      <b className="refreshText">
        You've requested too many times, please try again later!
      </b>
    </div>
  ) : (
    <div className="refresh">
      <Lottie
        style={{ marginTop: '-60px' }}
        options={defaultOptions}
        height={225}
        width={225}
      />
      <b className="refreshText">
        Please wait... This may take a moment
      </b>
    </div>
  );
}