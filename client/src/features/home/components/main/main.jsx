import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Privacy, Discover } from '../../../../pages/index';
import "./styles.scss";

export default function Main() {
  return (
    <main className='main'>
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/p" element={<Privacy />} />
      </Routes>
    </main>
  )
}
