import React, { useLayoutEffect } from 'react';
import { NavLink } from "react-router-dom";
import { useSignalEffect } from '@preact/signals-react';
import { FaUserFriends } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { toast } from 'react-toastify';

import { socket } from '../../../../services/lib/stocket.js';
import { authApiService, apiService } from '../../../../services';
import { contacts, myName, updateContacts } from '../../signals/signals';
import './style.scss';
import ProfilePic from '../profilePic/profilePic.jsx';

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

  useLayoutEffect(() => {
    const getMyFriends = async () => {
      try {
        const response = await apiService.getMyFriends();
        contacts.value = response.data;
        updateContacts.value = false;
      } catch (error) {
        toast.error('Something went wrong, please try again',
          {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }
        );
      }
    };

    getMyFriends();
  }, [updateContacts.value]);
}

export default function ContactList() {
  GetFriendsWithStatus();

  const Logout = async () => {
    try {
      authApiService.signOut();
    } catch (error) {
      toast.error('Something went wrong, please try again',
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    }
  }

  return (
    <aside className='contactsContainer'>
      <div className='contactsHeader'>
        <div className='contactsHeaderCon'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="6"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
          <h1>Chat</h1>
        </div>
      </div>

      <div className='sideMenuLink'>
        <NavLink className="link" activeclassname="active" to={`/chat/add`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="9"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          <span>Add friend</span>
        </NavLink>
        <NavLink className="link" activeclassname="active" to={`/chat/friends`}>
          <FaUserFriends />
          <span>Friends</span>
        </NavLink>
        <NavLink className="link" activeclassname="active" to={`/chat/friendreqs`}>
          <FaUserFriends />
          <span>Friend requests</span>
        </NavLink>
      </div>

      <div className='contacts'>
        {
          contacts.value.map((user) => (
            <NavLink key={user.friendId} className="contact" activeclassname="active" exact="true" to={`/chat/${user.friendId}`}>
              <ProfilePic username={user.friendUserName} />
              <span>{user.friendUserName}</span>
            </NavLink>
          ))
        }
      </div>

      <div className='profile'>
        <div className='myInfo'>
          <ProfilePic username={myName.value} />
          <span>{myName.value}</span>
        </div>
        <button onClick={() => Logout()}><MdLogout /></button>
      </div>
    </aside>
  );
};