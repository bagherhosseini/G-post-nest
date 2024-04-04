import { Routes, Route } from 'react-router-dom';
// import Footer from './features/footer/footer';
import { Home, Auth, VerifyEmail, ChatB } from './pages/index';
import { UserProvider } from './context/userInfoContext';
import './style/app.scss';
import { CheckAuth } from './features/app';
import AuthenticatedRoute from './features/app/components/authenticatedRoute/authenticatedRoute';

function App() {
  CheckAuth();
  return (
    <UserProvider>
      <div>
        <main>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home/*" element={<AuthenticatedRoute> <Home /> </AuthenticatedRoute>} />
            <Route path="/verifyEmail/:linkToken" element={<VerifyEmail />} />
            <Route path="/chat/:friendId" element={<ChatB />} />
          </Routes>
        </main>
      </div>
    </UserProvider>
  );
}

export default App;
