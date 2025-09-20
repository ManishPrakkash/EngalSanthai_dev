import React, { useState } from 'react';
import LoginPage from './components/LoginPage.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import OrderPage from './components/OrderPage.tsx';
import { useBillingData } from './hooks/useBillingData.ts';
import type { User } from './types.ts';
import { USERS_DATA } from './constants.ts';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const billingData = useBillingData();

  const handleLogin = (username: string, password: string) => {
    // Dummy authentication
    const user = USERS_DATA.find(u => u.id === username);
    if (user && password === user.role) { // Simple password check: password is the role
      setCurrentUser(user);
      setLoginError(null);
    } else {
      setLoginError('Invalid Employee ID or Password.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} error={loginError} clearError={() => setLoginError(null)} />;
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard 
      user={currentUser} 
      vegetables={billingData.vegetables}
      addVegetable={billingData.addVegetable}
      updateVegetable={billingData.updateVegetable}
      deleteVegetable={billingData.deleteVegetable}
      bills={billingData.bills}
      onLogout={handleLogout} 
    />;
  }

  return <OrderPage user={currentUser} vegetables={billingData.vegetables} addBill={billingData.addBill} onLogout={handleLogout} />;
};

export default App;