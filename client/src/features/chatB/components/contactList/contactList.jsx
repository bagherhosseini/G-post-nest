import React, { useEffect, useLayoutEffect } from 'react';
import { NavLink } from "react-router-dom";

import { apiService } from '../../../../services';
import { contacts } from '../../signals/signals';

const ContactList = () => {
  useLayoutEffect(() => {
    const getMyFriends = async () => {
      try {
        const response = await apiService.getMyFriends();
        contacts.value = response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getMyFriends();
  }, []);

  return (
    <aside className='contactsContainer'>
      <h1>Contacts</h1>
      <div className='contacts'>
        {
          contacts.value.map((contact) => (
            <NavLink key={contact.friendId} className="contact" activeclassname="active" exact="true" to={`/chat/${contact.friendId}`}>
              <img src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png" alt="" />
              <span>{contact.friendUserName}</span>
            </NavLink>
          ))
        }
      </div>
    </aside>
  );
};

export default ContactList;