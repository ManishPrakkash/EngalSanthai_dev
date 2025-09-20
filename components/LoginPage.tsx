
import React, { useState } from 'react';
import Button from './ui/Button.tsx';
import { XCircleIcon } from './ui/Icon.tsx';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  error: string | null;
  clearError: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error, clearError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) {
        clearError();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      if (error) {
          clearError();
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
           <h1 className="text-3xl font-bold tracking-tight text-primary-900">
            🥬 Engal Santhai
          </h1>
          <p className="mt-2 text-slate-500">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="block w-full px-3 py-2 bg-white border border-slate-300 placeholder-slate-400 text-slate-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="admin / user"
                value={username}
                onChange={handleUsernameChange}
              />
          </div>
          <div>
              <label htmlFor="password"  className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-3 py-2 bg-white border border-slate-300 placeholder-slate-400 text-slate-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="admin / user"
                value={password}
                onChange={handlePasswordChange}
              />
          </div>
          <div>
            {error && (
                <div role="alert" className="flex items-center p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                        <span className="font-medium">{error}</span>
                    </div>
                </div>
            )}
            <Button type="submit" className="w-full" size="lg">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;