import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmailContext } from '../context/EmailContext';
import { StatCard } from '../components/dashboard/StatCard';
import { ThreatRadar } from '../components/dashboard/ThreatRadar';
import { AIInsightOverview } from '../components/dashboard/AIInsightOverview';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { EmailCard } from '../components/email/EmailCard';
import { 
  Mail, 
  MailOpen, 
  Star, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  RotateCw,
  Zap,
  ArrowRight
} from 'lucide-react';

export const DashboardPage = () => {
  const { stats, emails, loading, resetData, setIsComposeOpen } = useEmailContext();
  const navigate = useNavigate();

  const importantEmails = emails.filter(e => e.isImportant && !e.isArchived).slice(0, 3);

  return (
    <div>
      {/* Dashboard Top Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <h1>Intelligence Command Center</h1>
          <p>Real-time AI email classification, threat interception, and executive productivity summary.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={resetData}
            title="Reset database to 14 sample emails"
          >
            <RotateCw size={15} />
            <span>Reset Demo</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setIsComposeOpen(true)}
          >
            <Plus size={16} />
            <span>New AI Email</span>
          </button>
        </div>
      </div>

      {/* Top 4 Stat Metric Cards */}
      <div className="stats-grid">
        <StatCard 
          title="Total Messages"
          value={stats.total || emails.length}
          icon={Mail}
          color="var(--accent-primary)"
          trend="14 Seeded realistic emails"
          onClick={() => navigate('/all')}
        />
        <StatCard 
          title="Unread Inbox"
          value={stats.unread || 0}
          icon={MailOpen}
          color="#38bdf8"
          trend="Requires attention"
          onClick={() => navigate('/inbox')}
        />
        <StatCard 
          title="Important & Starred"
          value={stats.important || 0}
          icon={Star}
          color="#eab308"
          trend="Auto-tagged by AI"
          onClick={() => navigate('/important')}
        />
        <StatCard 
          title="Threats & Phishing"
          value={stats.spam || 0}
          icon={ShieldAlert}
          color="#f43f5e"
          trend={`${stats.phishing || 0} Phishing + ${stats.suspicious || 0} Suspicious`}
          onClick={() => navigate('/spam')}
        />
      </div>

      {/* Security Threat Interception Banner */}
      <ThreatRadar stats={stats} />

      {/* 2-Column Dashboard Layout */}
      <div className="dashboard-columns">
        {/* Left Column: AI Digest & Priority Emails */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AIInsightOverview emails={emails} />

          {/* High Priority Email Quick View */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              background: 'rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={18} color="#eab308" fill="#eab308" />
                <h3 style={{ fontSize: '1.05rem' }}>Starred & Priority Messages</h3>
              </div>
              <button 
                type="button" 
                className="btn-ghost" 
                onClick={() => navigate('/important')}
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>View All ({stats.important})</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="email-items-list">
              {importantEmails.length > 0 ? (
                importantEmails.map(email => (
                  <EmailCard key={email._id || email.id} email={email} />
                ))
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  No starred emails currently.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Stream & AI Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <RecentActivity emails={emails} />

          {/* Fast AI Actions Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--accent-purple)" />
              <h3 style={{ fontSize: '1.05rem' }}>AI Quick Tools</h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Use Intelligent Assistant capabilities across your inbox:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsComposeOpen(true)}
                style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.85rem' }}
              >
                <Sparkles size={16} color="var(--accent-purple)" />
                <span>AI Email Generator</span>
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/security')}
                style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.85rem' }}
              >
                <ShieldCheck size={16} color="#10b981" />
                <span>Live Threat Sandbox Scanner</span>
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/settings')}
                style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.85rem' }}
              >
                <RotateCw size={16} color="var(--accent-secondary)" />
                <span>Gmail OAuth Architecture Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
