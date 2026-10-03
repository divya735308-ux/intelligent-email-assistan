import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEmailContext } from '../../context/EmailContext';
import { 
  Search, 
  Plus, 
  RotateCw, 
  Sun, 
  Moon, 
  ShieldAlert, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const Navbar = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    setIsComposeOpen, 
    theme, 
    toggleTheme, 
    resetData, 
    loading,
    stats 
  } = useEmailContext();

  const navigate = useNavigate();
  const location = useLocation();
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (location.pathname !== '/inbox' && location.pathname !== '/all') {
      navigate('/inbox');
    }
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <form onSubmit={handleSearchSubmit} className="nav-search-bar">
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search emails by sender, subject, keywords, or phishing flags..." 
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setSearchQuery(e.target.value);
            }}
          />
          {localSearch && (
            <button 
              type="button" 
              onClick={handleClearSearch}
              style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
            >
              ✕
            </button>
          )}
        </form>
      </div>

      <div className="nav-right">
        {/* Re-seed Demo Data Button */}
        <button 
          className="btn btn-secondary" 
          onClick={resetData}
          disabled={loading}
          title="Reset database to 14 realistic sample emails with AI analysis"
          style={{ fontSize: '0.84rem', padding: '7px 12px' }}
        >
          <RotateCw size={15} className={loading ? 'spin-animation' : ''} />
          <span>Reset Demo</span>
        </button>

        {/* AI Quick Compose */}
        <button 
          className="btn btn-ai"
          onClick={() => setIsComposeOpen(true)}
          style={{ padding: '8px 16px', gap: '6px' }}
        >
          <Sparkles size={16} />
          <span>AI Compose</span>
        </button>

        {/* Theme Toggle */}
        <button 
          className="btn btn-secondary btn-icon-only" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#6366f1" />}
        </button>

        {/* User Profile Avatar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '10px',
            borderLeft: '1px solid var(--border-color)'
          }}
        >
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.88rem',
              color: 'white',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
            }}
          >
            DM
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-bright)' }}>Demo User</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)' }}>Pro AI Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
