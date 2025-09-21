import React from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '../../types/types';

interface ProtectedRouteProps {
  user: User | null;
  requiredRole?: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, requiredRole, children }) => {
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to /');
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log(`ProtectedRoute: User role ${user.role} does not match required role ${requiredRole}, redirecting to /`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;