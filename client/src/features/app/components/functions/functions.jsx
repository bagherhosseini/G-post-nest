import { useNavigate } from 'react-router-dom';
import { useSignalEffect } from '@preact/signals-react';
import Cookies from "js-cookie"

export default function CheckAuth() {
  const navigate = useNavigate();
  const authToken = Cookies.get('authToken');
  useSignalEffect(() => {
    if(authToken === "undefined" || authToken === undefined || authToken === null || authToken === ""){
      navigate("/");
    }else if(authToken && window.location.pathname === "/"){
      navigate("/home");
    }else if(authToken){
      
    }
  });

  return null;
}