import React, { useState } from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DailyReport from '../components/reports/DailyReport';
import WeeklyReport from '../components/reports/WeeklyReport';
import MonthlyReport from '../components/reports/MonthlyReport';
import CustomReport from '../components/reports/CustomReport';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('daily');

  // Function to determine active tab class
  const getTabClass = (tabName) => {
    return `px-4 py-2 rounded-t-lg ${
      activeTab === tabName
        ? 'bg-white text-primary border-b-2 border-primary font-medium'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    }`;
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Attendance Reports</h1>

        {/* Tabs Navigation */}
        <div className="flex mb-6 border-b">
          <Link 
            to="/reports/daily" 
            className={getTabClass('daily')}
            onClick={() => setActiveTab('daily')}
          >
            Daily Report
          </Link>
          <Link 
            to="/reports/weekly" 
            className={getTabClass('weekly')}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly Report
          </Link>
          <Link 
            to="/reports/monthly" 
            className={getTabClass('monthly')}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly Report
          </Link>
          <Link 
            to="/reports/custom" 
            className={getTabClass('custom')}
            onClick={() => setActiveTab('custom')}
          >
            Custom Report
          </Link>
        </div>

        {/* Reports Content */}
        <div className="mt-4">
          <Routes>
            <Route path="/daily" element={<DailyReport />} />
            <Route path="/weekly" element={<WeeklyReport />} />
            <Route path="/monthly" element={<MonthlyReport />} />
            <Route path="/custom" element={<CustomReport />} />
            <Route path="/" element={<Navigate to="/reports/daily" replace />} />
          </Routes>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;