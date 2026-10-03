import React from 'react';
import { useEmailContext } from '../context/EmailContext';
import { 
  Settings, 
  RotateCw, 
  ShieldCheck, 
  Key, 
  Lock, 
  ExternalLink, 
  CheckCircle2, 
  Layers,
  Database,
  Moon,
  Sun,
  Bot
} from 'lucide-react';

export const SettingsPage = () => {
  const { resetData, loading, theme, toggleTheme, stats } = useEmailContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px' }}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Settings size={20} />
            </div>
            <h1>Settings & OAuth Architecture</h1>
          </div>
          <p>System configuration, demo database management, and Gmail OAuth integration guide.</p>
        </div>
      </div>

      {/* Demo Mode Management Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Demo Mode & Database Controls</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Reset your mailbox back to the initial 14 sample emails (including phishing, urgent tasks, and executive threads).
              </p>
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-primary"
            onClick={resetData}
            disabled={loading}
          >
            <RotateCw size={15} className={loading ? 'spin-animation' : ''} />
            <span>Reset Demo Database</span>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.84rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Total Records:</span>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-bright)' }}>{stats.total} Emails</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Database Driver:</span>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#10b981' }}>MongoDB / Embedded Store</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>AI Processing Mode:</span>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-secondary)' }}>Neural Heuristics v2.4</div>
          </div>
        </div>
      </div>

      {/* Gmail OAuth Integration Architecture Diagram (Requirement #15) */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <ShieldCheck size={22} color="#10b981" />
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Gmail OAuth 2.0 Integration Architecture</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Standard enterprise security workflow for connecting live Google Workspace / Gmail inboxes.
            </p>
          </div>
        </div>

        {/* Visual Flow Diagram */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '24px 20px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          overflowX: 'auto',
          marginBottom: '20px'
        }}>
          <div style={{ textAlign: 'center', minWidth: '130px' }}>
            <div style={{ width: '44px', height: '44px', margin: '0 auto 8px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              1
            </div>
            <strong style={{ fontSize: '0.86rem', display: 'block' }}>Google Sign-In</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>OAuth Consent Screen</span>
          </div>

          <div style={{ color: 'var(--accent-secondary)', fontWeight: 800 }}>→</div>

          <div style={{ textAlign: 'center', minWidth: '130px' }}>
            <div style={{ width: '44px', height: '44px', margin: '0 auto 8px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
              2
            </div>
            <strong style={{ fontSize: '0.86rem', display: 'block' }}>User Scopes</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Read/Send Permissions</span>
          </div>

          <div style={{ color: 'var(--accent-secondary)', fontWeight: 800 }}>→</div>

          <div style={{ textAlign: 'center', minWidth: '130px' }}>
            <div style={{ width: '44px', height: '44px', margin: '0 auto 8px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
              3
            </div>
            <strong style={{ fontSize: '0.86rem', display: 'block' }}>OAuth Token</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Encrypted Refresh Token</span>
          </div>

          <div style={{ color: 'var(--accent-secondary)', fontWeight: 800 }}>→</div>

          <div style={{ textAlign: 'center', minWidth: '130px' }}>
            <div style={{ width: '44px', height: '44px', margin: '0 auto 8px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-safe)' }}>
              4
            </div>
            <strong style={{ fontSize: '0.86rem', display: 'block' }}>Gmail API</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Sync & Intercept</span>
          </div>
        </div>

        {/* Security Checklist */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid var(--status-safe-border)',
          borderRadius: 'var(--radius-md)'
        }}>
          <h4 style={{ fontSize: '0.88rem', color: 'var(--status-safe)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={15} />
            <span>Security Compliance Checklist</span>
          </h4>
          <ul className="ai-bullet-list">
            <li className="ai-bullet-item" style={{ color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>Zero Password Exposure: Passwords never transit through or are stored in AegisMail.</span>
            </li>
            <li className="ai-bullet-item" style={{ color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>Environment Secrets: Client Secrets and API Keys stored exclusively in server environment variables.</span>
            </li>
            <li className="ai-bullet-item" style={{ color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>Token Encryption: Refresh tokens encrypted at rest via AES-256 backend storage.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Appearance & Interface</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ fontSize: '0.92rem' }}>Color Theme</strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Toggle between Dark Glassmorphism and Clean Light mode.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
            <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
