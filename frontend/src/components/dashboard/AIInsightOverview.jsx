import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, ListCheck, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export const AIInsightOverview = ({ emails = [] }) => {
  const navigate = useNavigate();

  // Extract all pending action items and deadlines from emails
  const priorityItems = [];
  const deadlines = [];

  emails.forEach(email => {
    const id = email._id || email.id;
    if (email.aiAnalysis?.actionItems && email.aiAnalysis.actionItems.length > 0 && !email.isArchived) {
      email.aiAnalysis.actionItems.forEach(item => {
        priorityItems.push({
          id,
          task: item,
          sender: email.senderName,
          subject: email.subject,
          isImportant: email.isImportant
        });
      });
    }

    if (email.aiAnalysis?.deadlines && email.aiAnalysis.deadlines.length > 0) {
      email.aiAnalysis.deadlines.forEach(dl => {
        deadlines.push({
          id,
          deadline: dl,
          sender: email.senderName,
          subject: email.subject
        });
      });
    }
  });

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Sparkles size={16} />
          </div>
          <h3 style={{ fontSize: '1.05rem' }}>AI Productivity Digest</h3>
        </div>
        <span className="sidebar-badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
          {priorityItems.length} Action Items
        </span>
      </div>

      {/* Action Items List */}
      <div>
        <h4 style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-secondary)', 
          textTransform: 'uppercase', 
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <ListCheck size={14} color="var(--accent-secondary)" />
          <span>Extracted Action Items</span>
        </h4>

        {priorityItems.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {priorityItems.slice(0, 4).map((item, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(`/email/${item.id}`)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  fontSize: '0.86rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: item.isImportant ? '#eab308' : 'var(--accent-primary)',
                    flexShrink: 0
                  }} />
                  <span style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    color: 'var(--text-primary)',
                    fontWeight: 500
                  }}>
                    {item.task}
                  </span>
                </div>
                <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No pending action items found.</p>
        )}
      </div>

      {/* Extracted Deadlines */}
      {deadlines.length > 0 && (
        <div>
          <h4 style={{ 
            fontSize: '0.8rem', 
            color: 'var(--text-secondary)', 
            textTransform: 'uppercase', 
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Calendar size={14} color="#f43f5e" />
            <span>Upcoming Milestones</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {deadlines.slice(0, 3).map((dl, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(`/email/${dl.id}`)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(244, 63, 94, 0.06)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={13} color="#fb7185" />
                  <span style={{ color: '#fecdd3', fontWeight: 600 }}>{dl.deadline}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{dl.sender}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
