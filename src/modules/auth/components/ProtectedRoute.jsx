import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


function ProtectedRoute({ children, redirectTo = '/login', allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {

    const fallbackHome = role === "ADMINISTRADOR" ? '/admin/home' : '/';

    return <Navigate to={fallbackHome} replace />;
  }

  return children;
}

export default ProtectedRoute;
