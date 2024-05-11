import { Routes, Route } from 'react-router-dom';
import { VerifyEmail, ChatB, Auth } from './pages/index';
import { UserProvider } from './context/userInfoContext';
import './style/app.scss';
import { ToastContainer as Toaster } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckAuth } from './features/app';
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
} from './features/chatB/signals/signals';

function App() {
  CheckAuth();
  socketListener();
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
