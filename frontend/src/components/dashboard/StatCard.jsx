import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = '#6366f1', trend = null, onClick = null }) => {
  return (
    <div 
      className={`stat-card ${onClick ? 'interactive' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon" style={{ color: color }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className="stat-value" style={{ color: color }}>
        {value}
      </div>

      {trend && (
        <div className="stat-footer">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};
