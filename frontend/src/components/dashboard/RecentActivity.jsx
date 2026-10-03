import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowUpRight, Mail, ShieldAlert, Sparkles, Star } from 'lucide-react';

export const RecentActivity = ({ emails = [] }) => {
  const navigate = useNavigate();

  const recentEmails = [...emails].slice(0, 5);

  const getActivityIcon = (email) => {
    if (email.spamCategory === 'PHISHING' || email.spamCategory === 'SPAM') {
      return <ShieldAlert size={14} color="#f43f5e" />;
    }
    if (email.isImportant) {
      return <Star size={14} color="#eab308" fill="#eab308" />;
    }
    return <Mail size={14} color="var(--accent-primary)" />;
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--accent-secondary)" />
          <h3 style={{ fontSize: '1.05rem' }}>Recent Activity Stream</h3>
        </div>
        <button 
          className="btn-ghost" 
          onClick={() => navigate('/inbox')}
          style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <span>View All</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {recentEmails.map((email) => {
          const id = email._id || email.id;
          const time = new Date(email.date || email.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
          });

          return (
            <div
              key={id}
              onClick={() => navigate(`/email/${id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getActivityIcon(email)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '0.86rem', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {email.subject}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    From: {email.senderName}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                {time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
