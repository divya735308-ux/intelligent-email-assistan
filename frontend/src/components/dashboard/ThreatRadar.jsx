import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Flame, ArrowRight, Activity } from 'lucide-react';

export const ThreatRadar = ({ stats }) => {
  const navigate = useNavigate();

  const totalThreats = (stats.phishing || 0) + (stats.suspicious || 0) + (stats.spam || 0);
  const total = stats.total || 14;
  const safePercent = Math.round(((stats.safe || 7) / total) * 100);

  return (
    <div className="threat-banner">
      <div className="threat-info">
        <div className="threat-icon-large">
          <Flame size={26} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fda4af' }}>
              {stats.phishing > 0 ? `${stats.phishing} Critical Phishing Threat${stats.phishing > 1 ? 's' : ''} Intercepted` : 'All Security Shields Active'}
            </h3>
            <span style={{ 
              fontSize: '0.72rem', 
              background: 'rgba(244, 63, 94, 0.25)', 
              color: '#fecdd3', 
              padding: '2px 8px', 
              borderRadius: '9999px',
              fontWeight: 700
            }}>
              LIVE SHIELD
            </span>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            AI neural heuristics detected credential phishing, fraudulent domain spoofing, and wire transfer scams.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-bright)' }}>
            {safePercent}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inbox Clean Index</span>
        </div>

        <button 
          className="btn btn-danger"
          onClick={() => navigate('/spam')}
          style={{ whiteSpace: 'nowrap', gap: '6px' }}
        >
          <span>Inspect Threats</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
