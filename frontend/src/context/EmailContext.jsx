import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const EmailContext = createContext();

export const useEmailContext = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmailContext must be used within an EmailProvider');
  }
  return context;
};

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    important: 0,
    spam: 0,
    phishing: 0,
    suspicious: 0,
    safe: 0,
    archived: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('aegis_theme') || 'dark');
  const [toasts, setToasts] = useState([]);

  // Toast Notification System
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toggle Theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('aegis_theme', nextTheme);
      return nextTheme;
    });
  }, []);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  // Fetch Dashboard Stats
  const refreshStats = useCallback(async () => {
    try {
      const res = await api.getStats();
      if (res && res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Fetch Emails according to activeFolder or query
  const loadEmails = useCallback(async (folder = activeFolder, query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (query && query.trim().length > 0) {
        res = await api.searchEmails(query.trim());
      } else {
        const filterParams = {};
        if (folder === 'important') {
          filterParams.folder = 'important';
        } else if (folder === 'spam') {
          filterParams.folder = 'spam';
        } else if (folder === 'archive') {
          filterParams.folder = 'archive';
        } else if (folder === 'all') {
          filterParams.folder = 'all';
        } else if (folder === 'inbox') {
          filterParams.folder = 'inbox';
        }
        res = await api.getEmails(filterParams);
      }

      if (res && res.success) {
        setEmails(res.data || []);
      }
      await refreshStats();
    } catch (err) {
      setError(err.message || 'Failed to load emails');
      addToast(err.message || 'Failed to load emails', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeFolder, searchQuery, addToast, refreshStats]);

  // Initial Load
  useEffect(() => {
    loadEmails(activeFolder, searchQuery);
  }, [activeFolder, searchQuery]);

  // Load single email by ID
  const loadEmailById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await api.getEmailById(id);
      if (res && res.success) {
        setCurrentEmail(res.data);
        // Update local list unread flag
        setEmails(prev => prev.map(e => (e._id === id || e.id === id) ? { ...e, isRead: true } : e));
        refreshStats();
        return res.data;
      }
    } catch (err) {
      addToast('Failed to load email details: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
    return null;
  }, [addToast, refreshStats]);

  // Mark as Read / Unread
  const toggleReadStatus = useCallback(async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.updateEmail(id, { isRead: newStatus });
      setEmails(prev => prev.map(e => (e._id === id || e.id === id) ? { ...e, isRead: newStatus } : e));
      if (currentEmail && (currentEmail._id === id || currentEmail.id === id)) {
        setCurrentEmail(prev => ({ ...prev, isRead: newStatus }));
      }
      refreshStats();
      addToast(newStatus ? 'Marked as read' : 'Marked as unread', 'info');
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  }, [currentEmail, refreshStats, addToast]);

  // Toggle Star / Important
  const toggleImportantStatus = useCallback(async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.updateEmail(id, { isImportant: newStatus });
      setEmails(prev => prev.map(e => (e._id === id || e.id === id) ? { ...e, isImportant: newStatus } : e));
      if (currentEmail && (currentEmail._id === id || currentEmail.id === id)) {
        setCurrentEmail(prev => ({ ...prev, isImportant: newStatus }));
      }
      refreshStats();
      addToast(newStatus ? 'Starred as important ⭐' : 'Unstarred', 'success');
    } catch (err) {
      addToast('Failed to update importance', 'error');
    }
  }, [currentEmail, refreshStats, addToast]);

  // Toggle Archive
  const toggleArchiveStatus = useCallback(async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.updateEmail(id, { isArchived: newStatus, folder: newStatus ? 'archive' : 'inbox' });
      setEmails(prev => prev.filter(e => (e._id !== id && e.id !== id)));
      if (currentEmail && (currentEmail._id === id || currentEmail.id === id)) {
        setCurrentEmail(prev => ({ ...prev, isArchived: newStatus, folder: newStatus ? 'archive' : 'inbox' }));
      }
      refreshStats();
      addToast(newStatus ? 'Email moved to archive 📦' : 'Email moved to inbox 📥', 'info');
    } catch (err) {
      addToast('Failed to update archive status', 'error');
    }
  }, [currentEmail, refreshStats, addToast]);

  // Delete Email
  const deleteEmailById = useCallback(async (id) => {
    try {
      await api.deleteEmail(id);
      setEmails(prev => prev.filter(e => (e._id !== id && e.id !== id)));
      if (currentEmail && (currentEmail._id === id || currentEmail.id === id)) {
        setCurrentEmail(null);
      }
      refreshStats();
      addToast('Email deleted successfully 🗑️', 'warning');
    } catch (err) {
      addToast('Failed to delete email', 'error');
    }
  }, [currentEmail, refreshStats, addToast]);

  // Reset Demo Data
  const resetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.resetDemoData();
      if (res && res.success) {
        addToast('✨ Demo database reset with 14 AI-analyzed sample emails!', 'success');
        await loadEmails(activeFolder, '');
        setSearchQuery('');
      }
    } catch (err) {
      addToast('Failed to reset demo data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [activeFolder, addToast, loadEmails]);

  // Send / Create New Email
  const sendEmail = useCallback(async (emailData) => {
    setLoading(true);
    try {
      const res = await api.createEmail(emailData);
      if (res && res.success) {
        addToast('✉️ Email processed and AI analyzed successfully!', 'success');
        setIsComposeOpen(false);
        await loadEmails(activeFolder, searchQuery);
        return res.data;
      }
    } catch (err) {
      addToast('Failed to send email: ' + err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [activeFolder, searchQuery, addToast, loadEmails]);

  const value = {
    emails,
    currentEmail,
    setCurrentEmail,
    stats,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activeFolder,
    setActiveFolder,
    isComposeOpen,
    setIsComposeOpen,
    theme,
    toggleTheme,
    toasts,
    addToast,
    removeToast,
    loadEmails,
    loadEmailById,
    toggleReadStatus,
    toggleImportantStatus,
    toggleArchiveStatus,
    deleteEmailById,
    resetData,
    sendEmail,
    refreshStats
  };

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
};
