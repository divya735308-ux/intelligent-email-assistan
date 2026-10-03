import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckSquare, 
  Square, 
  Calendar, 
  Tag, 
  Smile, 
  RotateCw, 
  ListCheck,
  Lightbulb
} from 'lucide-react';
import { api } from '../../services/api';
import { useEmailContext } from '../../context/EmailContext';

export const AIAnalysisPanel = ({ email, onAnalysisUpdated }) => {
  const { addToast } = useEmailContext();
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});

  if (!email) return null;

  const analysis = email.aiAnalysis || {};
  const summary = analysis.summary || 'Summary not generated yet.';
  const mainTopic = analysis.mainTopic || 'General Communication';
  const keyPoints = analysis.keyPoints || [];
  const actionItems = analysis.actionItems || [];
  const deadlines = analysis.deadlines || [];
  const sentiment = analysis.sentiment || 'Neutral';

  const toggleTask = (index) => {
    setCompletedTasks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    addToast(!completedTasks[index] ? 'Action item completed! ✅' : 'Action item uncompleted', 'info');
  };

  const handleRefreshAnalysis = async () => {
    const id = email._id || email.id;
    setIsReanalyzing(true);
    try {
      const res = await api.analyzeEmail(id);
      if (res && res.success) {
        addToast('✨ AI Intelligence analysis refreshed!', 'success');
        if (onAnalysisUpdated) {
          onAnalysisUpdated(res.data);
        }
      }
    } catch (err) {
      addToast('Analysis failed: ' + err.message, 'error');
    } finally {
      setIsReanalyzing(false);
    }
  };

  const getSentimentBadge = (sent) => {
    const s = (sent || '').toLowerCase();
    let bg = 'rgba(59, 130, 246, 0.12)';
    let color = '#60a5fa';
    if (s.includes('urgent') || s.includes('critical')) {
      bg = 'rgba(239, 68, 68, 0.15)';
      color = '#f87171';
    } else if (s.includes('positive') || s.includes('constructive')) {
      bg = 'rgba(16, 185, 129, 0.15)';
      color = '#34d399';
    } else if (s.includes('concern') || s.includes('warning')) {
      bg = 'rgba(245, 158, 11, 0.15)';
      color = '#fbbf24';
    }

    return (
      <span style={{
        background: bg,
        color: color,
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.76rem',
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        {sent}
      </span>
    );
  };

  return (
    <div className="ai-card">
      {/* Panel Header */}
      <div className="ai-card-header">
        <div className="ai-card-title">
          <Sparkles size={18} color="var(--accent-purple)" />
          <span>AI Executive Summary</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getSentimentBadge(sentiment)}
          <button 
            type="button" 
            className="btn-ghost btn-icon-only" 
            style={{ width: '28px', height: '28px' }}
            onClick={handleRefreshAnalysis}
            disabled={isReanalyzing}
            title="Re-run AI Analysis"
          >
            <RotateCw size={14} className={isReanalyzing ? 'spin-animation' : ''} />
          </button>
        </div>
      </div>

      {/* Main Topic & Category */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '14px',
        fontSize: '0.85rem'
      }}>
        <Tag size={15} color="var(--accent-secondary)" />
        <span style={{ color: 'var(--text-secondary)' }}>Topic:</span>
        <strong style={{ color: 'var(--text-bright)' }}>{mainTopic}</strong>
      </div>

      {/* Short Summary Text */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        fontSize: '0.9rem',
        lineHeight: 1.6,
        color: 'var(--text-primary)',
        marginBottom: '18px'
      }}>
        {summary}
      </div>

      {/* Key Takeaways */}
      {keyPoints.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ 
            fontSize: '0.82rem', 
            color: 'var(--text-secondary)', 
            textTransform: 'uppercase', 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Lightbulb size={14} color="#eab308" />
            <span>Key Takeaways</span>
          </h4>
          <ul className="ai-bullet-list">
            {keyPoints.map((pt, idx) => (
              <li key={idx} className="ai-bullet-item">
                <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Extracted Deadlines */}
      {deadlines.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ 
            fontSize: '0.82rem', 
            color: 'var(--text-secondary)', 
            textTransform: 'uppercase', 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Calendar size={14} color="#f43f5e" />
            <span>Deadlines & Milestones</span>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {deadlines.map((dl, idx) => (
              <div 
                key={idx} 
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(244, 63, 94, 0.08)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  color: '#fecdd3',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Calendar size={14} color="#fb7185" />
                <span>{dl}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Action Items */}
      {actionItems.length > 0 && (
        <div>
          <h4 style={{ 
            fontSize: '0.82rem', 
            color: 'var(--text-secondary)', 
            textTransform: 'uppercase', 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ListCheck size={14} color="var(--accent-secondary)" />
            <span>Required Actions ({actionItems.length})</span>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {actionItems.map((item, idx) => (
              <div 
                key={idx}
                className={`action-checkbox-item ${completedTasks[idx] ? 'completed' : ''}`}
                onClick={() => toggleTask(idx)}
              >
                {completedTasks[idx] ? (
                  <CheckSquare size={16} color="var(--status-safe)" />
                ) : (
                  <Square size={16} color="var(--text-muted)" />
                )}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
