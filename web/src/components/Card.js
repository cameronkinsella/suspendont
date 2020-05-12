import gavel from "../assets/gavel.png";
import trash from '../assets/trash.png'
import React from 'react';


export default function Card(props) {


  return (

    <div className="card">
      <div className="profilePicture">
        <img className="profilePicture" src={props.user.profile_pic} alt="profilepic"/>
      </div>
      <div className="textDetail">
        <div className="userID">@{props.user.screen_name}</div>
        <div className="dateBanned">{props.user.date}</div>
      </div>
      <img className="susPic"
           src={props.type === 'suspended' ? gavel : trash}
           alt="gavelPic"
      />
    </div>
  )
}
