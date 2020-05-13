import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faCog} from '@fortawesome/free-solid-svg-icons';
import {useCookies} from 'react-cookie';
import React, {useState} from 'react';
import useOnClickOutside from 'use-onclickoutside';
import ScrollBar from 'react-perfect-scrollbar';
import Profile from '../components/Profile';
import Card from '../components/Card';
import '../scrollbar.scss';

export default function Main(props) {
  const [active, setActive] = useState(false);
  const [showMenu, setMenu] = useState(false);
  const [showProfile, setProfile] = useState(false);
  const [suspended, setSuspended] = useState(props.profile.suspended);
  const [deleted, setDeleted] = useState(props.profile.deleted);
  const [, , removeCookie] = useCookies([null]);

  const changeMenu = () => {
    setActive(false);
    setMenu(false);
  };

  const changeTheme = () => {
    props.setDark(!props.darkMode);
  };

  const handleLogout = () => {
    const cookieList = ['user_id', 'oauth_token_secret', 'token', 'token_secret'];
    for (let i = 0; i < cookieList.length; i++) removeCookie(cookieList[i]);
    window.location.reload();
  };

  const ref = React.useRef(null);
  useOnClickOutside(ref, changeMenu);

  return (
    <div className={'app'}>
      <div className="sidebar">
        <FontAwesomeIcon icon={faTwitter} className="Twitter"/>
        <img className="profileButton" onClick={() => setProfile(!showProfile)}
             src={props.profile.profile_pic} alt={`${props.profile.screen_name}'s avatar`}/>
        {
          showProfile ?
            <span className="backgroundBlur" onClick={() => setProfile(!showProfile)}>
              <Profile profile={props.profile}/>
            </span> :
            null
        }
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
                  <b style={{marginBottom: '8px'}}>Theme</b>
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
          <ScrollBar component="div" className="scrollView">
            <div>
              {
                suspended && suspended[0] ?
                  suspended.map((user, i) => (
                    <Card user={user} type="suspended" key={i}/>
                  )) :
                  <div>
                    <img className="emptyImage" src={require('../assets/gavel.png')} alt={''}/>
                    <p className="emptyText">Nobody has been<br/>suspended yet</p>
                  </div>
              }
            </div>
          </ScrollBar>
        </div>
        <div className="Deleted">
          <div className="header">
            Deleted
          </div>
          <ScrollBar component="div" className="scrollView">
            {
              deleted && deleted[0] ?
                deleted.map((user, i) => (
                  <div>{user.screen_name}</div> // TODO replace with card component
                )) :
                <div>
                  <img className="emptyImage" src={require('../assets/trash.png')} alt={''}/>
                  <p className="emptyText">Nobody has been<br/>deleted yet</p>
                </div>
            }
          </ScrollBar>
        </div>
      </div>
    </div>
  );
}
