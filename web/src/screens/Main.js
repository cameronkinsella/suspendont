import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';
import React, { useState } from 'react';
import useOnClickOutside from 'use-onclickoutside';

export default function Main(props) {
  const [active, setActive] = useState(false);
  const [showMenu, setMenu] = useState(false);
  const [,, removeCookie] = useCookies([null]);

  const changeMenu = () => {
    setActive(false);
    setMenu(false);
  };

  const changeTheme = () => {
    props.setDark(!props.darkMode)
  };

  const handleLogout = () => {
    console.log('x');
    const cookieList = ['user_id', 'oauth_token_secret', 'token', 'token_secret'];
    for (let i = 0; i < cookieList.length; i++) removeCookie(cookieList[i]);
    window.location.reload()
  };

  const ref = React.useRef(null);
  useOnClickOutside(ref, changeMenu);

  return (
    <div className={'app'}>
      <div className="sidebar">
        <FontAwesomeIcon icon={faTwitter} className="Twitter"/>
        <div className="settings" ref={ref}>
          <FontAwesomeIcon
            icon={faCog}
            className={`cog ${active ? 'active' : null}`}
            onClick={() => {
              setMenu(!showMenu);
              setActive(!active);
            }}
          />
          {
            showMenu ?
              <div className="menu">
                <div className="theme">
                  <b style={{ marginBottom: '8px' }}>Theme</b>
                  <label>
                    <input name="theme" type="radio" value="light" checked={!props.darkMode} onChange={changeTheme}/>
                    Light
                  </label>
                  <label>
                    <input name="theme" type="radio" value="dark" checked={props.darkMode} onChange={changeTheme}/>
                    Dark
                  </label>
                </div>
                <button className="logout" onClick={handleLogout}><b>Log out</b></button>
              </div> :
              null
          }
        </div>
      </div>
      <div className="columns">
        <div className="Suspended">
          <div className="header">
            Suspended
          </div>
        </div>
        <div className="Deleted" >
          <div className="header" >
            Deleted
          </div>
        </div>
      </div>
    </div>
  );
}
