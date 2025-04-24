import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2F4F4F]">Welcome, {user.fullName}!</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#A38BFE] text-white rounded-xl hover:bg-[#9179f1]"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Learning Journey</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 