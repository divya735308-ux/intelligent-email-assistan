import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useEmailContext } from '../../context/EmailContext';
import { 
  LayoutDashboard, 
  Inbox, 
  Star, 
  ShieldAlert, 
  Mail, 
  Archive, 
  ShieldCheck, 
  Settings, 
  Plus,
  Sparkles,
  Bot
} from 'lucide-react';

export const Sidebar = () => {
  const { stats, setIsComposeOpen, setActiveFolder } = useEmailContext();
  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      label: 'Inbox',
      path: '/inbox',
      icon: Inbox,
      badge: stats.unread > 0 ? stats.unread : null,
      badgeClass: 'unread',
      folderKey: 'inbox'
    },
    {
      label: 'Important',
      path: '/important',
      icon: Star,
      badge: stats.important > 0 ? stats.important : null,
      badgeClass: '',
      folderKey: 'important'
    },
    {
      label: 'Spam & Threats',
      path: '/spam',
      icon: ShieldAlert,
      badge: stats.spam > 0 ? stats.spam : null,
      badgeClass: 'danger',
      folderKey: 'spam'
    },
    {
      label: 'All Emails',
      path: '/all',
      icon: Mail,
      badge: stats.total > 0 ? stats.total : null,
      badgeClass: '',
      folderKey: 'all'
    },
    {
      label: 'Archive',
      path: '/archive',
      icon: Archive,
      badge: stats.archived > 0 ? stats.archived : null,
      badgeClass: '',
      folderKey: 'archive'
    },
    {
      label: 'Threat Sandbox',
      path: '/security',
      icon: ShieldCheck,
      badge: 'Live',
      badgeClass: 'danger'
    },
    {
      label: 'Settings & OAuth',
      path: '/settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon-box">
          <Bot size={24} />
        </div>
        <div className="logo-text">
          <h2>AegisMail</h2>
          <span>AI Intelligence</span>
        </div>
      </div>

      {/* Compose Button */}
      <button 
        className="sidebar-compose-btn" 
        onClick={() => setIsComposeOpen(true)}
      >
        <Plus size={18} />
        <span>New Email</span>
        <Sparkles size={15} style={{ marginLeft: 'auto', opacity: 0.8 }} />
      </button>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (item.folderKey) {
                  setActiveFolder(item.folderKey);
                }
              }}
            >
              <div className="sidebar-link-content">
                <Icon size={19} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`sidebar-badge ${item.badgeClass || ''}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info / Engine Status */}
      <div className="sidebar-footer">
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: '#10b981',
              boxShadow: '0 0 6px #10b981'
            }} />
            <span>AI Neural Engine</span>
          </div>
          <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>v2.4 Active</span>
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
          🛡️ Phishing Protection Online
        </div>
      </div>
    </aside>
  );
};
