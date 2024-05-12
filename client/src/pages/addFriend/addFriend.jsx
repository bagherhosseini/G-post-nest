import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { apiService } from '../../services';
import './style.scss';

export default function AddFriend() {
  const [friendUserName, setfriendUserName] = useState('');

  const handleAddFriend = async (event) => {
    try {
      event.preventDefault();
      const response = await apiService.addFriend(friendUserName);
      toast.success(response.data.message,
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    } catch (error) {
      toast.error(error.response.data.message,
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
  
  return (
    <section className='addFriendSection'>
      <h1>Add friend</h1>
      <p>Enter your friend's username to send a friend request</p>
      <form onSubmit={(e)=> handleAddFriend(e)}>
        <input
          type="text"
          placeholder="Enter friend's username"
          value={friendUserName}
          onChange={(e) => setfriendUserName(e.target.value)}
        />
        <button type="submit">Send friend request</button>
      </form>
    </section>
  )
}
