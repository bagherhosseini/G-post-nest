import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { authApiService } from "../../services/index";
import './style.scss';

export default function VerifyEmail() {
  const [msg, setMsg] = useState();
  let { linkToken } = useParams();
  const navigate = useNavigate();

  async function verifyEmail(linkToken) {
    try {
      const response = await authApiService.verifyEmail(linkToken);
      const data = await response.json();
      if (data === "Email verified") {
        setMsg('Email verified');
        navigate("/home/");
      }
      setMsg('Unable to verify email');
    } catch (error) {
      setMsg('Unable to verify email');
      return;
    }
  };

  verifyEmail(linkToken);

  return (
    <section className='verifyEmail'>
      {!msg ? <h1>Verifing email....</h1> : <h1>{msg}</h1>}
    </section>
  )
}
