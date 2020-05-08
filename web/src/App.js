import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.scss';
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import * as closeMenu from "react";
import useOnClickOutside from "use-onclickoutside";

function App() {
  const [darkMode, setDarkMode] = React.useState(getInitialMode())
  React.useEffect(() => {
    localStorage.setItem('dark', JSON.stringify(darkMode))
  }, [darkMode])
  const [showMenu, setMenu] = useState(false)
  const changeMenu = ()=>{setMenu(!showMenu)}
  const ref = React.useRef(null)
  useOnClickOutside(ref, changeMenu)

  function getInitialMode() {
    const isReturningUser = "dark" in localStorage;
    const savedMode = JSON.parse(localStorage.getItem('dark'));
    const userPrefersDark = getPrefColorScheme();

    if (isReturningUser) {
      return savedMode;
    } else if (userPrefersDark) {
      return true;
    } else {
      return false;
    }
  }



  function getPrefColorScheme() {
    if (!window.matchMedia) return;

    return window.matchMedia("(prefers-color-scheme: dark)")
      .matches;
  }
  
  return (
    <div className={darkMode ? "dark-mode" : "app"}>
      <div className="sidebar">
        <FontAwesomeIcon icon={faTwitter} className="Twitter"/>
        <div className="settings" ref={ref}>
        <FontAwesomeIcon icon={faCog} className="cog" onClick={()=>{setMenu(!showMenu)}}/>
        {
          showMenu ?
          <div className="menu">
            <tr>
          <td><button
            className="theme"
            onClick={() => setDarkMode(prevMode => !prevMode)}>Theme</button></td>
            </tr>
            <tr>
          <td><button className="logout"> Logout</button></td>
            </tr>

        </div>:
            null
        }
        </div>
      </div>
      <div className="columns">
        <div className="Suspended">
          <div className="p">
            Suspended
          </div>
        </div>

        <div className="Deleted">
          <div className="p">
            Deleted
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
