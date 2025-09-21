import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './src/components/LoginPage';
import AdminDashboard from './src/components/AdminDashboard';
import OrderPage from './src/components/OrderPage';
import AdminChoicePage from './src/components/AdminChoicePage';
import ProtectedRoute from './src/components/ProtectedRoute';
import { useBillingData } from './hooks/useBillingData';
import type { User } from './types/types';
import { loginWithEmployeeID, auth, observeUser } from './src/services/authService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './src/firebase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const billingData = useBillingData();
  const navigate = useNavigate();

  // Observe Firebase auth state
  useEffect(() => {
    const unsubscribe = observeUser(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUser({ ...docSnap.data(), id: firebaseUser.uid } as User);
          } else {
            const defaultUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.email || '',
              role: 'faculty',
            };
            await setDoc(docRef, {
              name: firebaseUser.email || '',
              role: 'faculty',
              createdAt: new Date(),
            });
            setCurrentUser(defaultUser);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      } catch (err: any) {
        console.error('Error in observeUser:', err);
        setLoginError(err.message || 'Failed to fetch user data');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopstate = async () => {
      if (currentUser) {
        console.log('Back/forward navigation detected, logging out');
        try {
          await auth.signOut();
          setCurrentUser(null);
          navigate('/', { replace: true });
        } catch (err: any) {
          console.error('Error during popstate logout:', err);
          setLoginError(err.message || 'Failed to log out');
        }
      }
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [currentUser, navigate]);

  // Handle login from LoginPage
  const handleLogin = async (employeeID: string, phone: string) => {
    try {
      setLoading(true);
      const userCredential = await loginWithEmployeeID(employeeID, phone);
      console.log('Authenticated user:', userCredential.user);
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      let role: string;
      if (!docSnap.exists()) {
        role = 'faculty';
        await setDoc(docRef, {
          name: userCredential.user.email || '',
          role,
          createdAt: new Date(),
        });
      } else {
        const data = docSnap.data();
        role = data.role;
      }
      const loggedUser: User = {
        id: userCredential.user.uid,
        name: userCredential.user.email || '',
        role,
      };
      setCurrentUser(loggedUser);
      setLoginError(null);

      // Role-based navigation
      if (role === 'admin') {
        navigate('/admin-choice', { replace: true });
      } else if (role === 'faculty') {
        navigate('/dashboard', { replace: true });
      } else {
        console.error('Invalid role assigned:', role);
        alert('Invalid role assigned.');
        await auth.signOut();
        setCurrentUser(null);
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Logout error:', err);
      setLoginError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage onLogin={handleLogin} error={loginError} clearError={() => setLoginError(null)} />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={currentUser}>
            <OrderPage
              user={currentUser}
              vegetables={billingData.vegetables}
              addBill={billingData.addBill}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute user={currentUser} requiredRole="admin">
            <AdminDashboard
              user={currentUser}
              vegetables={billingData.vegetables}
              addVegetable={billingData.addVegetable}
              updateVegetable={billingData.updateVegetable}
              deleteVegetable={billingData.deleteVegetable}
              bills={billingData.bills}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-choice"
        element={
          <ProtectedRoute user={currentUser} requiredRole="admin">
            <AdminChoicePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;