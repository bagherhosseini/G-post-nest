import React from 'react';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import "./styles.scss";

export default function Nav() {
  return (
    <nav className='nav'>
      <h1>G-Post</h1>

      <div className='menu'>
        <p>MENU</p>

        <div className='links'>
          <NavLink className="link" activeclassname="active" exact="true" to="/home/">
            <FontAwesomeIcon className='linkIcon' icon={faHouse} /> <span>Discover</span>
          </NavLink>

          <NavLink className="link" activeclassname="active" exact="true" to="/home/p"> 
            <FontAwesomeIcon className='linkIcon' icon={faHouse} /> <span>Trending</span>
          </NavLink>

          <NavLink className="link" activeclassname="active" exact="true" to="/home/f"> 
            <FontAwesomeIcon className='linkIcon' icon={faHouse} /> <span>Streaming</span>
          </NavLink>
          <NavLink className="link" activeclassname="active" exact="true" to="/home/g"> 
            <FontAwesomeIcon className='linkIcon' icon={faHouse} /> <span>Playlist</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
