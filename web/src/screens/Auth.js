import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Lottie from '../components/Lottie';
import { getTwitterAccessToken } from '../functions/api';
import { useHistory } from 'react-router-dom';
import animation from '../assets/loader.json';

export default function Auth() {
  const [cookies, setCookie] = useCookies([null]);

  const history = useHistory();

  useEffect(() => {
    const [, oauthToken, oauthVerifier] =
    window.location.search.match(
      /^(?=.*oauth_token=([^&]+)|)(?=.*oauth_verifier=([^&]+)|).+$/,
    ) || [];

    if (oauthToken === undefined || cookies.oauth_token_secret === undefined || oauthVerifier === undefined)
      window.location.replace(window.origin);

    const params = {
      oauth_token: oauthToken,
      oauth_token_secret: cookies.oauth_token_secret,
      oauth_verifier: oauthVerifier,
    };

    getTwitterAccessToken(params).then(res => {
      setCookie('token', res.oauth_token);
      setCookie('token_secret', res.oauth_token_secret);
      setCookie('user_id', res.user_id);
      history.push('/');
    });
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="loader">
    <Lottie
      options={defaultOptions}
      height={400}
      width={400}
    />
    </div>
  );
}
