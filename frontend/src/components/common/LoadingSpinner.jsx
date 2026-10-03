import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading AI Intelligence...', size = 28 }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 20px',
      gap: '16px',
      color: 'var(--text-secondary)'
    }}>
      <div style={{ position: 'relative' }}>
        <Loader2 size={size} className="spin-animation" style={{ color: 'var(--accent-primary)' }} />
        <Sparkles size={size * 0.45} style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'var(--accent-secondary)'
        }} />
      </div>
      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</p>
      <style>{`
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
