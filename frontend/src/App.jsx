import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmailProvider } from './context/EmailContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { InboxPage } from './pages/InboxPage';
import { EmailDetailPage } from './pages/EmailDetailPage';
import { SecurityCenterPage } from './pages/SecurityCenterPage';
import { SettingsPage } from './pages/SettingsPage';
import './styles/index.css';

function App() {
  return (
    <EmailProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="inbox" element={<InboxPage folderType="inbox" />} />
            <Route path="important" element={<InboxPage folderType="important" />} />
            <Route path="spam" element={<InboxPage folderType="spam" />} />
            <Route path="all" element={<InboxPage folderType="all" />} />
            <Route path="archive" element={<InboxPage folderType="archive" />} />
            <Route path="email/:id" element={<EmailDetailPage />} />
            <Route path="security" element={<SecurityCenterPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EmailProvider>
  );
}

export default App;
