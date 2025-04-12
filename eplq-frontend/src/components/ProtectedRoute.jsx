import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return <Outlet />;
};
