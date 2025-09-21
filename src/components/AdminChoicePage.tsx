import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminChoicePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Select Dashboard</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/admindashboard')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminChoicePage;