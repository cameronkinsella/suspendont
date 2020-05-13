import React from 'react';

export default function Profile(props) {

  const bannerSrc = () => {
    if (props.profile.profile_banner === undefined) {
      return props.darkMode ?
        '../assets/dark-banner.png' :
        '../assets/light-banner.png';
    }
    return props.profile.profile_banner;
  };

  return (
    <div className="profile" onClick={e => e.stopPropagation()}>
      <a className="profileBanner"
         href={`https://twitter.com/${props.profile.screen_name}`}
         style={{backgroundImage: `url(${bannerSrc()})`}}
      >
        <div className="profileBannerOverlay"/>
        <div className="profileBannerContent">
          <img className="profilePic" src={props.profile.profile_pic}
               alt={`${props.profile.screen_name}'s avatar`}
          />
          <strong className="profileStrongText" style={{fontSize: '24px'}}>
            {props.profile.name}
          </strong>
          <strong className="profileStrongText" style={{fontSize: '18px'}}>
            @{props.profile.screen_name}
          </strong>
        </div>
      </a>
      <p className="profileFollowingCount">
        Following<br/>
        <b>{props.profile.friends_count}</b>
      </p>
    </div>
  );
}