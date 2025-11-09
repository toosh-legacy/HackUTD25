import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { GlobalProvider } from './contexts/GlobalContext'; // ✅ new global context
import GlobalAlerts from './components/GlobalAlerts'; // ✅ global alert system
import './css/App.css';

// ✅ Admin Pages (now in /pages)
import AlertsPage from './pages/AlertsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ServerStatusPage from './pages/ServerStatusPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalProvider> {/* ✅ Wrap app to share announcements/server state */}
          <div className="app-container">
            <Navbar />

            {/* 🔔 Global alert notifications (announcements + server down) */}
            <GlobalAlerts />

            <main className="main-content">
              <Routes>
                {/* 🔓 Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* 🔐 Private (User) Routes */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/report"
                  element={
                    <PrivateRoute>
                      <ReportProblem />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/status"
                  element={
                    <PrivateRoute>
                      <Status />
                    </PrivateRoute>
                  }
                />

                {/* 🛠️ Admin-Only Routes (only visible for sai@gmail.com) */}
                <Route
                  path="/alerts"
                  element={
                    <AdminRoute>
                      <AlertsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/announcements"
                  element={
                    <AdminRoute>
                      <AnnouncementsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/server-status"
                  element={
                    <AdminRoute>
                      <ServerStatusPage />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>

            {/* 💬 Chat tab visible everywhere */}
            <ChatBotTab />
          </div>
        </GlobalProvider>
      </AuthProvider>
    </Router>
  );
}
