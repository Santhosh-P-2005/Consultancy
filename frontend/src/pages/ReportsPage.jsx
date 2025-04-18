import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DailyReport from '../components/reports/DailyReport';
import WeeklyReport from '../components/reports/WeeklyReport';
import MonthlyReport from '../components/reports/MonthlyReport';
import CustomReport from '../components/reports/CustomReport';

const ReportsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') || 'daily';

  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const getTabClass = (tabName) => {
    return `tab ${activeTab === tabName ? 'active' : ''}`;
  };

  const renderActiveReport = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyReport />;
      case 'weekly':
        return <WeeklyReport />;
      case 'monthly':
        return <MonthlyReport />;
      case 'custom':
        return <CustomReport />;
      default:
        return <DailyReport />;
    }
  };

  return (
    <MainLayout>
      <div className="reports-container">
        <h1 className="reports-title">Attendance Reports</h1>

        {/* Tab Navigation */}
        <div className="tabs">
          <div onClick={() => setActiveTab('daily')} className={getTabClass('daily')}>
            Daily Report
          </div>
          <div onClick={() => setActiveTab('weekly')} className={getTabClass('weekly')}>
            Weekly Report
          </div>
          <div onClick={() => setActiveTab('monthly')} className={getTabClass('monthly')}>
            Monthly Report
          </div>
          <div onClick={() => setActiveTab('custom')} className={getTabClass('custom')}>
            Custom Report
          </div>
        </div>

        <div className="report-container">{renderActiveReport()}</div>
      </div>



      {/* CSS Styles */}
      <style jsx>{`
        .reports-container {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .reports-title {
          font-size: 24px;
          font-weight: bold;
          color: #4b5563; /* Primary color */
          margin-bottom: 24px;
        }

        .tabs {
          display: flex;
          border-bottom: 2px solid #d1d5db;
          margin-bottom: 24px;
          gap: 16px;
        }

        .tab {
          padding: 8px 16px;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .tab:hover {
          background-color: #f3f4f6;
        }

        .active {
          background-color: white;
          color: #3b82f6; /* Blue color for active tab */
          border-bottom: 2px solid #3b82f6;
          font-weight: 600;
        }

        .report-container {
          padding-top: 16px;
        }
      `}</style>
    </MainLayout>
  );
};

export default ReportsPage;
