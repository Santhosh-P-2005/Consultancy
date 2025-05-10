import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <Header />
      <div className="layout-container">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
      
      {/* Embedded CSS */}
      <style>{`
        :root {
          --header-height: 4rem;
          --sidebar-width: 16rem;
          --background-color: #f3f4f6;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: var(--background-color);
        }

        .layout-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: relative;
        }

        .layout-container {
          display: flex;
          flex: 1;
          padding-top: var(--header-height);
        }

        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          padding: 1.5rem;
          max-width: 100%;
          overflow-x: hidden;
        }

        /* For smaller screens (responsive design) */
        @media (max-width: 1024px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;