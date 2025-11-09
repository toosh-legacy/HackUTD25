import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  const adminEmails = ['sai@gmail.com', 'fanenfury@gmail.com'];
  if (!adminEmails.includes(user.email)) {
    // Logged in but not admin → redirect home
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized admin
  return children;
}
