import React, { useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {getTwitterRequestToken} from '../functions/api';
import Lottie from '../components/Lottie';
import animation from '../assets/loader-white.json';
import {faTwitter} from '@fortawesome/free-brands-svg-icons';
import Refresh from '../components/Refresh';

export default function Login(props) {
  const [error, setError] = useState(true);

  const sendToAuth = async () => {
    const res = await getTwitterRequestToken();

    props.setCookie('oauth_token_secret', res.oauth_token_secret);
    window.location.replace(`https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauth_token}`);
  };

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
    </div>
  ) : (
    <div className="login">
      <div className="loginButton" onClick={sendToAuth}>
        <FontAwesomeIcon style={{marginBottom: '40px'}} icon={faTwitter} size={'3x'}/>
        <b>Log in</b>
      </div>
      {
        props.error && error &&
        <span className="backgroundBlur" onClick={() => setError(false)}>
          <Refresh error={true} darkMode={false}/>
        </span>
      }
    </div>
  );

}
