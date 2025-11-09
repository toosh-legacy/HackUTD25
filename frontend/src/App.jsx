import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import ReportProblem from './pages/ReportProblem';
import Status from './pages/Status';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import ChatBotTab from './components/ChatBotTab'; // ✅ Import here
import './css/App.css';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/report" element={<PrivateRoute><ReportProblem /></PrivateRoute>} />
              <Route path="/status" element={<PrivateRoute><Status /></PrivateRoute>} />
            </Routes>
          </main>

          {/* 👇 Fixed chat tab visible everywhere */}
          <ChatBotTab />
        </div>
      </AuthProvider>
    </Router>
  );
}
