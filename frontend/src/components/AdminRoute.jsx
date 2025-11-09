import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user.email !== 'sai@gmail.com') {
    // Logged in but not admin → redirect home
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized admin
  return children;
}
