import React from 'react';
import { Routes, Route } from 'react-router-dom';

import {
  ContactList,
} from '../../index';

import { AddFriend, Friends, FriendReqs } from '../../../../pages';
import Chat from '../chat/chat';

export default function PageContent({ handleCall }) {

  return (
    <section className='content'>
      <ContactList />
      <Routes>
        <Route path="/:id" element={<Chat handleCall={handleCall} />} />
        <Route path="/add" element={<AddFriend />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friendreqs" element={<FriendReqs />} />
      </Routes>
    </section>
  )
}
