import { Routes, Route } from 'react-router-dom';
// import Footer from './features/footer/footer';
import { Home, Auth, VerifyEmail, ChatB } from './pages/index';
import { UserProvider } from './context/userInfoContext';
import './style/app.scss';
import { CheckAuth } from './features/app';

function App() {
  CheckAuth();
  return (
    <UserProvider>
      <div>
        <main>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home/*" element={<Home />} />
            <Route path="/verifyEmail/:linkToken" element={<VerifyEmail />} />
            <Route path="/chat/:userId" element={<ChatB />} />
          </Routes>
        </main>
      </div>
    </UserProvider>
  );
}

export default App;
