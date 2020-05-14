import gavel from '../assets/gavel.png';
import trash from '../assets/trash.png'
import React from 'react';
import '../App.scss'


export default function Card(props) {


  return (

    <div className="card">
        <img className="cardProfilePicture" src={props.user.profile_pic} alt="profilepic"/>
      <div className="textDetail">
        <div className="userId">@{props.user.screen_name}</div>
        <div className="dateBanned">{props.user.date}</div>
      </div>
      <img className="susPic"
           src={props.type === 'suspended' ? gavel : trash}
           alt="gavelPic"
      />
    </div>
  )
}
