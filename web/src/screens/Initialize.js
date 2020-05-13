import React, {useEffect, useState} from 'react';
import '../App.scss';
import {useCookies} from 'react-cookie';
import authCheck from '../functions/authCheck';
import Main from './Main';
import Login from './Login';

/*
Cookies hold the following:
token, token_secret, user_id

profile state holds the following:
name, screen_name, friends_count, profile_pic, profile_banner

localStorage holds the following:
theme
 */

export default function Initialize() {
  const [darkMode, setDarkMode] = useState(getInitialMode());
  const [isAuth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [cookies, setCookie] = useCookies(['token']);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(darkMode));
    const getAuthState = async () => {
      if (!isAuth) {
        await setAuth(await authCheck(cookies, setCookie, setProfile));
      }
    };
    setCookie('client', 'web', {path: '/'});
    getAuthState().then(() => {
      setLoading(false)
    });
  });

  return (
    <div className={(darkMode ? 'theme--dark' : 'theme--default')}>
      {
        isAuth ?
          <Main darkMode={darkMode} setDark={setDarkMode} profile={profile}/> :
          <Login setCookie={setCookie} loading={loading}/>
      }
    </div>
  );
}

function getInitialMode() {
  const getPrefColorScheme = () => {
    if (!window.matchMedia) return;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const isReturningUser = 'theme' in localStorage;
  const savedMode = JSON.parse(localStorage.getItem('theme'));
  const userPrefersDark = getPrefColorScheme();

  if (isReturningUser) {
    return savedMode;
  } else return userPrefersDark;
}
