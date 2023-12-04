import { useNavigate } from 'react-router-dom';
import { useSignalEffect } from '@preact/signals-react';
import useCookie from '../../../../hooks/useCookie';

export default function CheckAuth() {
  const navigate = useNavigate();
  const [authToken, updateAuthToken, removeAuthToken] = useCookie("authToken");
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