import React, { useState, useMemo } from 'react';
import { EmailCard } from './EmailCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useEmailContext } from '../../context/EmailContext';
import { 
  Inbox, 
  Filter, 
  CheckCheck, 
  RotateCw, 
  ShieldAlert, 
  MailQuestion,
  Flame
} from 'lucide-react';

export const EmailList = ({ emails = [], title = 'Inbox', subtitle = null }) => {
  const { loading, resetData, toggleReadStatus } = useEmailContext();
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'STARRED' | 'SAFE' | 'SPAM' | 'PHISHING'
  const [sortBy, setSortBy] = useState('DATE_DESC');

  // Filter emails based on active sub-tab
  const filteredEmails = useMemo(() => {
    let list = [...emails];

    if (activeFilter === 'UNREAD') {
      list = list.filter(e => !e.isRead);
    } else if (activeFilter === 'STARRED') {
      list = list.filter(e => e.isImportant);
    } else if (activeFilter === 'SAFE') {
      list = list.filter(e => e.spamCategory === 'SAFE');
    } else if (activeFilter === 'SPAM') {
      list = list.filter(e => e.spamCategory === 'SPAM' || e.isSpam);
    } else if (activeFilter === 'PHISHING') {
      list = list.filter(e => e.spamCategory === 'PHISHING' || e.spamCategory === 'SUSPICIOUS');
    }

    // Sort
    if (sortBy === 'DATE_DESC') {
      list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    } else if (sortBy === 'DATE_ASC') {
      list.sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
    } else if (sortBy === 'RISK_DESC') {
      list.sort((a, b) => (b.spamScore || 0) - (a.spamScore || 0));
    }

    return list;
  }, [emails, activeFilter, sortBy]);

  // Mark all unread emails in current view as read
  const handleMarkAllRead = async () => {
    const unreadOnes = filteredEmails.filter(e => !e.isRead);
    for (const email of unreadOnes) {
      const id = email._id || email.id;
      await toggleReadStatus(id, false);
    }
  };

  if (loading && emails.length === 0) {
    return <LoadingSpinner text="Retrieving & analyzing emails..." />;
  }

  return (
    <div className="email-list-container">
      {/* Header Toolbar */}
      <div className="email-list-toolbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{title}</h2>
            <span className="sidebar-badge" style={{ fontSize: '0.8rem' }}>
              {filteredEmails.length} {filteredEmails.length === 1 ? 'Email' : 'Emails'}
            </span>
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{subtitle}</p>
          )}
        </div>

        {/* Filter Pills */}
        <div className="email-filter-tabs">
          <button 
            type="button"
            className={`filter-tab ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All ({emails.length})
          </button>
          <button 
            type="button"
            className={`filter-tab ${activeFilter === 'UNREAD' ? 'active' : ''}`}
            onClick={() => setActiveFilter('UNREAD')}
          >
            Unread ({emails.filter(e => !e.isRead).length})
          </button>
          <button 
            type="button"
            className={`filter-tab ${activeFilter === 'STARRED' ? 'active' : ''}`}
            onClick={() => setActiveFilter('STARRED')}
          >
            Starred ({emails.filter(e => e.isImportant).length})
          </button>
          <button 
            type="button"
            className={`filter-tab ${activeFilter === 'SAFE' ? 'active' : ''}`}
            onClick={() => setActiveFilter('SAFE')}
          >
            Safe
          </button>
          <button 
            type="button"
            className={`filter-tab ${activeFilter === 'PHISHING' ? 'active' : ''}`}
            onClick={() => setActiveFilter('PHISHING')}
            style={activeFilter === 'PHISHING' ? { background: '#f43f5e' } : {}}
          >
            <Flame size={12} style={{ display: 'inline', marginRight: '3px' }} />
            Threats ({emails.filter(e => e.spamCategory === 'PHISHING' || e.spamCategory === 'SUSPICIOUS').length})
          </button>
        </div>

        {/* Quick Actions & Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}
          >
            <option value="DATE_DESC">Newest First</option>
            <option value="DATE_ASC">Oldest First</option>
            <option value="RISK_DESC">Highest Threat Score</option>
          </select>

          {filteredEmails.some(e => !e.isRead) && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleMarkAllRead}
              title="Mark all in current view as read"
              style={{ fontSize: '0.78rem', padding: '6px 10px' }}
            >
              <CheckCheck size={14} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Email List Items */}
      {filteredEmails.length > 0 ? (
        <div className="email-items-list">
          {filteredEmails.map((email) => (
            <EmailCard key={email._id || email.id} email={email} />
          ))}
        </div>
      ) : (
        <div style={{
          padding: '64px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            <MailQuestion size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>No emails found</h3>
            <p style={{ fontSize: '0.88rem' }}>No messages match the current filter or search criteria.</p>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={resetData}
            style={{ marginTop: '8px' }}
          >
            <RotateCw size={15} />
            <span>Restore 14 Demo Emails</span>
          </button>
        </div>
      )}
    </div>
  );
};
