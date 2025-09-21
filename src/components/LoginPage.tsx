// src/components/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import Button from './ui/Button.tsx';
import { XCircleIcon } from './ui/Icon.tsx';
import { loginWithEmployeeID } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../services/authService';
interface LoginPageProps {
  error?: string | null;
  clearError: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ error, clearError }) => {
  const [employeeID, setEmployeeID] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize Google reCAPTCHA
  useEffect(() => {
    if ((window as any).grecaptcha && !document.getElementById('recaptcha-container-rendered')) {
      (window as any).grecaptcha.render('recaptcha-container', {
        sitekey: '6LeCQ88rAAAAAJS8alTA0099YgvVMV3jGFVwsvLU', // replace with your site key
        theme: 'light',
      });
      document.getElementById('recaptcha-container')?.setAttribute('id', 'recaptcha-container-rendered');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!document.getElementById('recaptcha-container-rendered')) {
        (window as any).grecaptcha.render('recaptcha-container', {
          sitekey: '6LeCQ88rAAAAAJS8alTA0099YgvVMV3jGFVwsvLU',
          theme: 'light',
        });
        document.getElementById('recaptcha-container')?.setAttribute('id', 'recaptcha-container-rendered');
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      // Verify reCAPTCHA
      const recaptchaToken = (window as any).grecaptcha?.getResponse();
      if (!recaptchaToken) {
        alert('Please complete reCAPTCHA');
        setLoading(false);
        return;
      }

      // Firebase login
      const userCredential = await loginWithEmployeeID(employeeID, phone);

      // Fetch role from Firestore
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert('User record not found in DB');
        setLoading(false);
        return;
      }

      const data = docSnap.data();
      const role = data.role;

      // Role-based navigation
// Role-based navigation
if (role === 'admin') {
  navigate('/admin-choice');
} else if (role === 'faculty') {
  navigate('/dashboard');
} else {
  console.error('Invalid role assigned:', role);
  alert('Invalid role assigned.');
  await auth.signOut();
  setCurrentUser(null);
  navigate('/');
}

      // Reset reCAPTCHA
      (window as any).grecaptcha?.reset();
    } catch (err: any) {
      console.error(err);
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary-900">🥬 Engal Santhai</h1>
          <p className="mt-2 text-slate-500">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="employeeID" className="block text-sm font-medium text-slate-700 mb-1">
              Employee ID
            </label>
            <input
              id="employeeID"
              name="employeeID"
              type="text"
              autoComplete="username"
              required
              className="block w-full px-3 py-2 bg-white border border-slate-300 placeholder-slate-400 text-slate-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter your Employee ID"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full px-3 py-2 bg-white border border-slate-300 placeholder-slate-400 text-slate-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Google reCAPTCHA */}
          <div id="recaptcha-container" className="my-4"></div>

          <div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign in'}
            </Button>
            {error && (
              <div role="alert" className="flex items-center p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-lg">
                <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
