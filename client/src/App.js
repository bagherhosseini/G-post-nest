import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { VerifyEmail, ChatB, Auth } from './pages/index';
import { UserProvider } from './context/userInfoContext';
import './style/app.scss';
import { ToastContainer as Toaster } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckAuth } from './features/app';
import Cookies from "js-cookie";
import {
  socketListener,
  OutGoingCall as OutGoingCallUI,
  InCommingCall as InCommingCallUI,
  CallAccepted as CallAcceptedUI,
}
  from './features/chatB';

import {
  outGoingCall,
  inCommingCall,
  callAccepted,
  myName,
  messages,
} from './features/chatB/signals/signals';
import { apiService } from './services';
import { useSignalEffect } from '@preact/signals-react';

function App() {
  const authToken = Cookies.get('authToken');
  CheckAuth();
  
  useSignalEffect(() => {
    socketListener();
  });

  useEffect(() => {
    async function getMyInfo() {
      if(authToken){
        const info = await apiService.getMyInfo();
  
        if (info.status === 200) {
          myName.value = info.data.user.userName;
        }
      }
    }

    getMyInfo();
  }, []);
  
  return (
    <UserProvider>
      <div>
        {outGoingCall.value && <OutGoingCallUI />}
        {inCommingCall.value && <InCommingCallUI />}
        {callAccepted.value && <CallAcceptedUI />}
        <main>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/verifyEmail/:linkToken" element={<VerifyEmail />} />
            <Route path="/chat/*" element={<ChatB />} />
          </Routes>
        </main>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
        />
      </div>
    </UserProvider>
  );
}

export default App;
