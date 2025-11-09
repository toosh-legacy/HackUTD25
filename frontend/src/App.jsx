import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import ReportProblem from './pages/ReportProblem';
import Status from './pages/Status';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ChatBotTab from './components/ChatBotTab';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalProvider } from './contexts/GlobalContext';
import GlobalAlerts from './components/GlobalAlerts';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import { auth, db } from './firebase';
import './css/App.css';

// Admin Pages
import AlertsPage from './pages/AlertsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ServerStatusPage from './pages/ServerStatusPage';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verify Firebase initialization
    try {
      if (!auth || !db) {
        throw new Error('Firebase services not initialized');
      }
      setInitialized(true);
    } catch (err) {
      console.error('App initialization error:', err);
      setError(err.message);
    }
  }, []);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        textAlign: 'center',
        background: 'linear-gradient(to bottom right, #ffffff, #fce7f3)'
      }}>
        <h1 style={{ color: '#e20074', marginBottom: '20px' }}>Unable to start application</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: '#e20074',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!initialized) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <AuthProvider>
        <GlobalProvider>
          <ErrorBoundary>
            <div className="app-container">
              <Navbar />
              
              <GlobalAlerts />

              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Private Routes */}
                  <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                  <Route path="/report" element={<PrivateRoute><ReportProblem /></PrivateRoute>} />
                  <Route path="/status" element={<PrivateRoute><Status /></PrivateRoute>} />

                  {/* Admin Routes */}
                  <Route path="/alerts" element={<AdminRoute><AlertsPage /></AdminRoute>} />
                  <Route path="/announcements" element={<AdminRoute><AnnouncementsPage /></AdminRoute>} />
                  <Route path="/server-status" element={<AdminRoute><ServerStatusPage /></AdminRoute>} />

                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </main>
              
              <ChatBotTab />
            </div>
          </ErrorBoundary>
        </GlobalProvider>
      </AuthProvider>
    </Router>
  );
}
