import React, { useEffect, useLayoutEffect } from 'react';
import { NavLink } from "react-router-dom";
import { useSignalEffect } from '@preact/signals-react';

import { socket } from '../../../../services/lib/stocket.js';
import { apiService } from '../../../../services';
import { contacts } from '../../signals/signals';

function GetFriendsWithStatus() {
  useSignalEffect(() => {
    socket.on('userStatus', (data) => {
      const updatedContacts = contacts.value.map(contact => {
        if (contact.friendId === data.id) {
          return { ...contact, userStatus: data.status };
        }
        return contact;
      });
      contacts.value = updatedContacts;
    });
  });

  function getFriendsStatus(id) {
    socket.emit('userStatus', { userId: id });
  }

  useLayoutEffect(() => {
    const getMyFriends = async () => {
      try {
        const response = await apiService.getMyFriends();
        contacts.value = response.data;

        response.data.forEach((user) => {
          getFriendsStatus(user.friendId);
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getMyFriends();
  }, []);
}

const ContactList = () => {
  GetFriendsWithStatus();

  console.log(contacts.value)

  return (
    <aside className='contactsContainer'>
      <h1>Contacts</h1>
      <div className='contacts'>
        {
          contacts.value.map((user) => (
            <NavLink key={user.friendId} className="contact" activeclassname="active" exact="true" to={`/chat/${user.friendId}`}>
              <img src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png" alt="" />
              <span>{user.friendUserName}</span>
            </NavLink>
          ))
        }
      </div>
    </aside>
  );
};

export default ContactList;