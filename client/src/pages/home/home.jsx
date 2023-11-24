import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Nav, Main } from '../../features/home/index';
import "./styles.scss"


export default function Home() {
  const navigate = useNavigate();

  async function getTodos() {
    try {
      const response = await fetch('http://localhost:5050/chat', {
        method: 'GET',
        credentials: "include",
        headers: {
        'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data);
      if(data === "Authentication error: jwt expired" || data === "Authentication error: jwt must be provided" || data === "Token not found"){
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <section className='home'>
      <div className='content'>
        <Nav />
        <Main />
      </div>
    </section>
  )
}
