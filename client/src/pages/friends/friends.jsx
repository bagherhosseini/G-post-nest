import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import { FaTrash } from "react-icons/fa";

import './style.scss';
import { apiService } from '../../services';
import { ProfilePic } from '../../features/chatB';
import { updateContacts } from '../../features/chatB/signals/signals';

export default function Friends() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await apiService.getMyFriends();
        setFriends(response.data);
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
        console.error(error);
      }
    }
    fetchFriends();
  }, [])
  
  const handleRemoveFriend = async (friendId, id) => {
    try {
      const response = await apiService.removeFriend(friendId);
      if (response || response.status === 200) {
        updateContacts.value = true;
        const updatedFriends = friends.filter((friend) => friend.id !== id);
        setFriends(updatedFriends);
        toast.success(response.data.message,
          {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }
        );
      }
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
      console.error(error);
    }
  }

  return (
    <section className='friendsSection'>
      <h1>Friends</h1>
      <div className='friendsList'>
        {friends.map((friend) => (
          <div key={friend.id} className='friend'>
            <div className='friendInfo'>
              <ProfilePic username={friend.friendUserName} />
              <p>{friend.friendUserName}</p>
            </div>
            <button className='removeFriend' onClick={()=> handleRemoveFriend(friend.friendId, friend.id)}><FaTrash /></button>
          </div>
        ))}
      </div>
    </section>
  )
}
