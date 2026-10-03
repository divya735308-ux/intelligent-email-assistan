import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { EmailComposeModal } from '../email/EmailComposeModal';
import { ToastContainer } from '../common/Toast';

export const Layout = () => {
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar />

        <main className="content-scrollable">
          <Outlet />
        </main>
      </div>

      {/* Global Compose Modal & Toasts */}
      <EmailComposeModal />
      <ToastContainer />
    </div>
  );
};
