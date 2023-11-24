import React from 'react';
import "./style.scss";
import { Discovers, Recommendeds } from '../../features/discover/index';

export default function Discover() {
  return (
    <section className='discover'>
      <Discovers />
      <Recommendeds />
    </section>
  )
}
