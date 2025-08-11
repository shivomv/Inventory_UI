import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardWidgets from './DashboardWidgets';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening in your inventory.</p>
        </div>
      </div>

      <DashboardWidgets onNavigate={handleNavigate} />
    </div>
  );
};

export default Dashboard;
