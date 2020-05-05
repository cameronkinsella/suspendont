import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './App.css';
import {icon} from '@fortawesome/fontawesome-svg-core';
import {faTwitter} from "@fortawesome/free-brands-svg-icons";

function App() {
  return (
    <div className="app">

      <div className="sidebar">
        <FontAwesomeIcon icon={faTwitter} className="Twitter"/>
      </div>

      <div className="Suspended">
        <span className="headerSuspended">
        Suspended
      </span>
      </div>


      <div className="Deleted">
        <span className="headerDeleted">
        Deleted
      </span>

      </div>
    </div>
  );
}

export default App;
