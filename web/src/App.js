import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.scss';
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

function App() {
  return (
    <div className="app">

      <div className="sidebar">
        <FontAwesomeIcon icon={faTwitter} className="Twitter"/>
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
