import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import { FaTrash, FaCheck } from "react-icons/fa";

import './style.scss';
import { apiService } from '../../services';
import { ProfilePic } from '../../features/chatB';
import { updateContacts } from '../../features/chatB/signals/signals';

export default function FriendReqs() {
    const [friendReqs, setfriendReqs] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await apiService.friendRequests();
                setfriendReqs(response.data);
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

    const handleRemoveFriend = async (friendId, id, isReceived) => {
        try {
            const response = await apiService.removeFriend(friendId);
            if (response && response.status === 200) {
                if (isReceived) {
                    const updatedFriends = friendReqs.receivedRequests.filter(friend => friend.id !== id);
                    setfriendReqs(
                        prev => ({
                            ...prev,
                            receivedRequests: updatedFriends,
                        }),
                    );
                } else {
                    const updatedFriends = friendReqs.sentRequests.filter(friend => friend.id !== id);
                    setfriendReqs(
                        prev => ({
                            ...prev,
                            sentRequests: updatedFriends,
                        }),
                    );
                }

                toast.success(response.data.message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            }
        } catch (error) {
            toast.error(error.response.message, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            console.error(error);
        }
    };

    const handleAcceptFriend = async (friendId, id) => {
        try {
            const response = await apiService.acceptFriend(id);
            console.log(response);
            if (response && response.status === 200) {
                updateContacts.value = true;
                const updatedFriends = friendReqs.receivedRequests.filter(friend => friend.id !== id);
                setfriendReqs(
                    prev => ({
                        ...prev,
                        receivedRequests: updatedFriends,
                    }),
                );
             
                toast.success(response.data.message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            }
        } catch (error) {
            console.log(error)
            // toast.error(error.response.message, {
            //     style: {
            //         borderRadius: '10px',
            //         background: '#333',
            //         color: '#fff',
            //     },
            // });
            // console.error(error);
        }
    };

    return (
        <section className='friendReqsSection'>
            <h1>Friend requests</h1>
            <div className='friendsList'>
                {friendReqs.sentRequests && friendReqs.sentRequests.map((friend) => (
                    <div key={friend.id} className='friend'>
                        <div className='friendInfo'>
                            <ProfilePic username={friend.friendUserName} />
                            <p>{friend.friendUserName}</p>
                        </div>
                        <button className='removeFriend' onClick={() => handleRemoveFriend(friend.friendId, friend.id, false)}><FaTrash /></button>
                    </div>
                ))}

                {friendReqs.receivedRequests && friendReqs.receivedRequests.map((friend) => (
                    <div key={friend.id} className='friend'>
                        <div className='friendInfo'>
                            <ProfilePic username={friend.friendUserName} />
                            <p>{friend.friendUserName}</p>
                        </div>
                        <div className='action'>
                            <button className='acceptFriend' onClick={() => handleAcceptFriend(friend.friendId, friend.id,)}><FaCheck /></button>
                            <button className='removeFriend' onClick={() => handleRemoveFriend(friend.friendId, friend.id, true)}><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
