import React from 'react';
import { NavLink } from "react-router-dom";

const ContactList = () => {
  return (
    <aside className='contactsContainer'>
      <h1>Contacts</h1>
      <div className='contacts'>
        <NavLink className="contact" activeclassname="active" exact="true" to="/chat/1">
          <img src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png" alt="" />
          <span>Bagher</span>
        </NavLink>
        <NavLink className="contact" activeclassname="active" exact="true" to="/chat/200">
          <img src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png" alt="" />
          <span>Bagher</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default ContactList;