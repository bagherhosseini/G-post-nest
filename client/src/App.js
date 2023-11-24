import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Footer from './features/footer/footer';
import { Home, Auth, VerifyEmail, ChatB } from './pages/index';
import { UserProvider } from './context/userInfoContext';
import './style/app.scss';

function App() {
  return (
    <UserProvider>
      <div>
        <main>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/home/*" element={<Home />} />
              <Route path="/verifyEmail/:linkToken" element={<VerifyEmail />} />
              <Route path="/chat/:userId" element={<ChatB />} />
            </Routes>
          </BrowserRouter>
        </main>
      </div>
    </UserProvider>
  );
}

export default App;
