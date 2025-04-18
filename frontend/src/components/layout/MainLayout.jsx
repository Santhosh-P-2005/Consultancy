import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <>
      <style>
        {`
          .layout-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: #f3f4f6; /* Tailwind's bg-gray-100 */
          }

          .layout-body {
            display: flex;
            flex: 1;
          }

          .layout-main {
            flex: 1;
            margin-left: 16rem; /* Tailwind's ml-64 (64 * 0.25rem = 16rem) */
            padding: 1.5rem;
          }
        `}
      </style>

      <div className="layout-wrapper">
        <Header />
        <div className="layout-body">
          <Sidebar />
          <main className="layout-main">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
