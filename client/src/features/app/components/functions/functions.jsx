import { useNavigate } from 'react-router-dom';
import { useSignalEffect } from '@preact/signals-react';
import Cookies from "js-cookie";

import { apiService } from '../../../../services';

export default function CheckAuth() {
  const navigate = useNavigate();
  const id = localStorage.getItem('id');
  const authToken = Cookies.get('authToken');
  useSignalEffect(() => {
    async function getMyInfo(doNavigate = false) {
      const myInfo = await apiService.getMyInfo();

      if (myInfo.data) {
        localStorage.setItem("id", myInfo.data.user.id);

        if (doNavigate) {
          navigate("/chat/friends");
        }
      } else {
        Cookies.remove('authToken');
        localStorage.removeItem("id");
        navigate("/");
      }
    }

    if (authToken === "undefined" || authToken === undefined || authToken === null || authToken === "") {
      navigate("/");
      localStorage.removeItem("id");
    } else if (authToken && window.location.pathname === "/") {
      if (id === "undefined" || id === undefined || id === null || id === "" || id === '' || id === "null") {
        getMyInfo(true);
      } else {
        navigate("/chat/friends");
      }
    } else if (authToken) {
      if (id === "undefined" || id === undefined || id === null || id === "" || id === '' || id === "null") {
        getMyInfo(false);
      }
    }
  });

  return null;
}