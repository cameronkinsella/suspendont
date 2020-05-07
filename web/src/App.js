import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.scss';
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";

function App() {

  function refreshPage() { /*remove after testing cog button */
    window.location.reload(false);

  }
  return (
    <div className="app">

      <div className="sidebar">
        <FontAwesomeIcon icon={faTwitter} className="Twitter"/>
        <FontAwesomeIcon icon={faCog} className="cog" onClick={refreshPage}/>
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
